#!/usr/bin/env python3
"""
Teste simples de RLS no Supabase.
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Carrega as variáveis de ambiente do arquivo .test.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.test.env'))

def test_public_access(supabase: Client):
    """Testa o acesso público à tabela de questões."""
    print("🔍 Testando acesso público...")
    try:
        response = supabase.table('questions').select('*').limit(1).execute()
        if response.data:
            print("  ✅ Qualquer pessoa pode ler as questões (conforme esperado)")
            return True
        else:
            print("  ⚠️  Nenhuma questão encontrada, mas o acesso de leitura é permitido")
            return True
    except Exception as e:
        print(f"  ❌ Falha ao ler questões: {str(e)}")
        return False

def sign_in_user(supabase: Client, email: str, password: str):
    """Autentica um usuário e retorna um cliente autenticado."""
    print(f"\n🔑 Tentando autenticar: {email}")
    try:
        # Autentica o usuário
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if not hasattr(auth_response, 'session') or not auth_response.session:
            print("❌ Falha na autenticação: sessão não encontrada")
            return None
            
        access_token = auth_response.session.access_token
        user_id = auth_response.user.id
        
        print(f"  ✅ Autenticado com sucesso!")
        print(f"  - User ID: {user_id}")
        
        # Cria um novo cliente com o token de acesso
        auth_client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_ANON_KEY")
        )
        
        # Configura o token de acesso diretamente
        auth_client.postgrest.auth(access_token)
        
        return auth_client
        
    except Exception as e:
        print(f"❌ Erro ao autenticar usuário: {str(e)}")
        return None

def test_authenticated_access(client: Client, user_type: str = "regular"):
    """Testa o acesso autenticado."""
    print(f"\n👤 Testando acesso de usuário {user_type}...")
    
    # Testa a leitura de questões
    try:
        response = client.table('questions').select('*').limit(1).execute()
        if response.data:
            print(f"  ✅ Usuário {user_type} pode ler questões")
        else:
            print(f"  ⚠️  Nenhuma questão encontrada para usuário {user_type}")
    except Exception as e:
        print(f"  ❌ Falha ao ler questões: {str(e)}")
    
    # Testa a atualização de questões (deve falhar para usuários regulares)
    if user_type == "regular":
        try:
            # Tenta atualizar uma questão
            questions = client.table('questions').select('id').limit(1).execute()
            if questions.data:
                question_id = questions.data[0]['id']
                update_response = client.table('questions').update({"category": "Teste"}).eq('id', question_id).execute()
                print("  ❌ Usuário regular não deveria conseguir atualizar questões!")
            else:
                print("  ⚠️  Nenhuma questão para testar atualização")
        except Exception as e:
            if "permission denied" in str(e).lower():
                print("  ✅ Usuário regular não pode atualizar questões (conforme esperado)")
            else:
                print(f"  ❌ Erro inesperado ao testar atualização: {str(e)}")

def main():
    """Função principal."""
    print("🚀 Iniciando Testes RLS do Supabase")
    print("=" * 50)
    
    # Inicializa o cliente Supabase
    supabase = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_ANON_KEY")
    )
    
    # Testa acesso público
    if not test_public_access(supabase):
        print("\n❌ Testes de acesso público falharam. Verifique a configuração do Supabase.")
        return
    
    # Testa acesso autenticado
    print("\n🔑 Testando acesso autenticado...")
    
    # Credenciais do usuário
    test_email = "simulaioab@gmail.com"
    test_password = "4815162342"
    
    # Autentica o usuário
    auth_client = sign_in_user(supabase, test_email, test_password)
    
    if auth_client:
        # Testa o acesso autenticado
        test_authenticated_access(auth_client, "regular")
    
    print("\n✅ Testes concluídos!")

if __name__ == "__main__":
    main()
