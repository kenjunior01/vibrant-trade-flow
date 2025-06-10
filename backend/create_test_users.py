
#!/usr/bin/env python3
"""
Script para criar usuários de teste no banco de dados Flask.
Execute este script para popular o banco com os usuários de teste.
"""

import sys
import os

# Adicionar o diretório backend ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import User, UserRole, Wallet

def create_test_users():
    """Cria usuários de teste no banco de dados."""
    
    test_users = [
        {
            'email': 'trader@test.com',
            'password': '123456',
            'full_name': 'João Trader',
            'role': UserRole.TRADER
        },
        {
            'email': 'manager@test.com',
            'password': '123456',
            'full_name': 'Maria Gestora',
            'role': UserRole.MANAGER
        },
        {
            'email': 'admin@test.com',
            'password': '123456',
            'full_name': 'Carlos Admin',
            'role': UserRole.ADMIN
        },
        {
            'email': 'superadmin@test.com',
            'password': '123456',
            'full_name': 'Ana Super Admin',
            'role': UserRole.SUPERADMIN
        }
    ]
    
    with app.app_context():
        # Criar tabelas se não existirem
        db.create_all()
        
        for user_data in test_users:
            # Verificar se o usuário já existe
            existing_user = User.query.filter_by(email=user_data['email']).first()
            
            if not existing_user:
                # Criar novo usuário
                user = User(
                    email=user_data['email'],
                    full_name=user_data['full_name'],
                    role=user_data['role']
                )
                user.set_password(user_data['password'])
                
                db.session.add(user)
                db.session.flush()  # Para obter o ID do usuário
                
                # Criar carteira padrão para traders
                if user_data['role'] == UserRole.TRADER:
                    wallet = Wallet(user_id=user.id)
                    db.session.add(wallet)
                
                print(f"✅ Usuário criado: {user_data['email']} ({user_data['role'].value})")
            else:
                print(f"⚠️  Usuário já existe: {user_data['email']}")
        
        # Commit todas as mudanças
        db.session.commit()
        print("\n🎉 Todos os usuários de teste foram criados com sucesso!")
        print("\nCredenciais de teste:")
        print("=" * 50)
        for user_data in test_users:
            print(f"Email: {user_data['email']}")
            print(f"Senha: {user_data['password']}")
            print(f"Role: {user_data['role'].value}")
            print("-" * 30)

if __name__ == '__main__':
    create_test_users()
