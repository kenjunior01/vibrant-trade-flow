
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import emit, join_room, leave_room
from app import socketio, db
from models import User, UserRole
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

# Store active chat rooms and participants
active_rooms = {}
user_rooms = {}

@socketio.on('connect')
@jwt_required()
def on_connect():
    """Handle user connection to chat"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return False
        
        print(f"User {user.full_name} connected to chat")
        emit('status', {'msg': f'{user.full_name} has connected'})
        
    except Exception as e:
        print(f"Connection error: {e}")
        return False

@socketio.on('disconnect')
def on_disconnect():
    """Handle user disconnection"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user and user_id in user_rooms:
            # Leave all rooms
            for room in user_rooms[user_id]:
                leave_room(room)
                if room in active_rooms:
                    active_rooms[room].discard(user_id)
            
            del user_rooms[user_id]
            print(f"User {user.full_name} disconnected from chat")
            
    except Exception as e:
        print(f"Disconnection error: {e}")

@socketio.on('join_room')
@jwt_required()
def on_join_room(data):
    """Handle user joining a chat room"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        room_id = data.get('room')
        
        if not user or not room_id:
            return
        
        # Validate room access based on user role
        if not can_access_room(user, room_id):
            emit('error', {'msg': 'Access denied to this room'})
            return
        
        join_room(room_id)
        
        # Track user rooms
        if user_id not in user_rooms:
            user_rooms[user_id] = set()
        user_rooms[user_id].add(room_id)
        
        # Track room participants
        if room_id not in active_rooms:
            active_rooms[room_id] = set()
        active_rooms[room_id].add(user_id)
        
        emit('status', {
            'msg': f'{user.full_name} joined the room',
            'room': room_id,
            'participants': len(active_rooms[room_id])
        }, room=room_id)
        
        print(f"User {user.full_name} joined room {room_id}")
        
    except Exception as e:
        print(f"Join room error: {e}")

@socketio.on('leave_room')
@jwt_required()
def on_leave_room(data):
    """Handle user leaving a chat room"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        room_id = data.get('room')
        
        if not user or not room_id:
            return
        
        leave_room(room_id)
        
        # Update tracking
        if user_id in user_rooms and room_id in user_rooms[user_id]:
            user_rooms[user_id].discard(room_id)
        
        if room_id in active_rooms:
            active_rooms[room_id].discard(user_id)
        
        emit('status', {
            'msg': f'{user.full_name} left the room',
            'room': room_id,
            'participants': len(active_rooms.get(room_id, []))
        }, room=room_id)
        
        print(f"User {user.full_name} left room {room_id}")
        
    except Exception as e:
        print(f"Leave room error: {e}")

@socketio.on('send_message')
@jwt_required()
def on_send_message(data):
    """Handle sending a chat message"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return
        
        room_id = data.get('room')
        message = data.get('message', '').strip()
        
        if not room_id or not message:
            emit('error', {'msg': 'Room and message are required'})
            return
        
        # Validate room access
        if not can_access_room(user, room_id):
            emit('error', {'msg': 'Access denied to this room'})
            return
        
        # Validate message length
        if len(message) > 1000:
            emit('error', {'msg': 'Message too long (max 1000 characters)'})
            return
        
        # Create message object
        message_data = {
            'id': f"msg_{datetime.utcnow().isoformat()}_{user_id}",
            'user_id': user_id,
            'user_name': user.full_name,
            'user_role': user.role.value,
            'message': message,
            'timestamp': datetime.utcnow().isoformat(),
            'room': room_id
        }
        
        # Emit to room
        emit('receive_message', message_data, room=room_id)
        
        print(f"Message sent by {user.full_name} in room {room_id}: {message[:50]}...")
        
    except Exception as e:
        print(f"Send message error: {e}")
        emit('error', {'msg': 'Failed to send message'})

@socketio.on('typing')
@jwt_required()
def on_typing(data):
    """Handle typing indicator"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        room_id = data.get('room')
        is_typing = data.get('typing', False)
        
        if not user or not room_id:
            return
        
        # Validate room access
        if not can_access_room(user, room_id):
            return
        
        emit('user_typing', {
            'user_id': user_id,
            'user_name': user.full_name,
            'typing': is_typing,
            'room': room_id
        }, room=room_id, include_self=False)
        
    except Exception as e:
        print(f"Typing indicator error: {e}")

def can_access_room(user, room_id):
    """Check if user can access a specific chat room"""
    try:
        # Room naming convention:
        # 'general' - public room for all users
        # 'support' - support room for all users
        # 'manager_{manager_id}' - private room for manager and their clients
        # 'private_{user1_id}_{user2_id}' - private room between two users
        
        if room_id in ['general', 'support']:
            return True
        
        if room_id.startswith('manager_'):
            manager_id = room_id.replace('manager_', '')
            
            # Managers can access their own rooms
            if user.role == UserRole.MANAGER and user.id == manager_id:
                return True
            
            # Traders can access their manager's room
            if user.role == UserRole.TRADER and user.manager_id == manager_id:
                return True
            
            # Admins can access any manager room
            if user.role in [UserRole.ADMIN, UserRole.SUPERADMIN]:
                return True
        
        if room_id.startswith('private_'):
            # Extract user IDs from private room
            parts = room_id.replace('private_', '').split('_')
            if len(parts) == 2:
                user1_id, user2_id = parts
                return user.id in [user1_id, user2_id]
        
        # Admins can access any room
        if user.role in [UserRole.ADMIN, UserRole.SUPERADMIN]:
            return True
        
        return False
        
    except Exception as e:
        print(f"Room access check error: {e}")
        return False

# REST API endpoints for chat

@chat_bp.route('/rooms', methods=['GET'])
@jwt_required()
def get_available_rooms():
    """Get list of available chat rooms for the user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        rooms = []
        
        # Add public rooms
        rooms.extend([
            {
                'id': 'general',
                'name': 'General Discussion',
                'type': 'public',
                'description': 'General chat for all users'
            },
            {
                'id': 'support',
                'name': 'Support',
                'type': 'support',
                'description': 'Get help from support team'
            }
        ])
        
        # Add role-specific rooms
        if user.role == UserRole.MANAGER:
            rooms.append({
                'id': f'manager_{user.id}',
                'name': 'My Clients',
                'type': 'manager',
                'description': 'Chat with your assigned clients'
            })
        
        elif user.role == UserRole.TRADER and user.manager_id:
            manager = User.query.get(user.manager_id)
            if manager:
                rooms.append({
                    'id': f'manager_{user.manager_id}',
                    'name': f'Manager: {manager.full_name}',
                    'type': 'manager',
                    'description': 'Chat with your account manager'
                })
        
        # Add admin rooms for admins
        if user.role in [UserRole.ADMIN, UserRole.SUPERADMIN]:
            rooms.append({
                'id': 'admin_only',
                'name': 'Admin Only',
                'type': 'admin',
                'description': 'Private admin discussions'
            })
        
        return jsonify({'rooms': rooms}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/rooms/<room_id>/participants', methods=['GET'])
@jwt_required()
def get_room_participants(room_id):
    """Get current participants in a chat room"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not can_access_room(user, room_id):
            return jsonify({'error': 'Access denied'}), 403
        
        participant_ids = active_rooms.get(room_id, set())
        participants = []
        
        for pid in participant_ids:
            participant = User.query.get(pid)
            if participant:
                participants.append({
                    'id': participant.id,
                    'name': participant.full_name,
                    'role': participant.role.value
                })
        
        return jsonify({
            'room_id': room_id,
            'participants': participants,
            'count': len(participants)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
