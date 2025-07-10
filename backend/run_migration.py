#!/usr/bin/env python3
"""
Script para executar migrações SQL no Supabase
"""

import os
import sys
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

def load_environment():
    """Carrega variáveis de ambiente do arquivo .env"""
    # Força o uso apenas do arquivo .env do backend
    backend_env = Path(__file__).parent / '.env'
    
    if backend_env.exists():
        # Limpa variáveis existentes para evitar conflito
        for key in ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY']:
            if key in os.environ:
                del os.environ[key]
        
        load_dotenv(backend_env, override=True)
        print(f"✓ Carregado arquivo .env de: {backend_env}")
    else:
        print(f"⚠️  Arquivo .env não encontrado em: {backend_env}")
        print("Tentando usar variáveis de ambiente do sistema...")

def get_supabase_client():
    """Cria cliente Supabase com as credenciais do ambiente"""
    url = os.getenv('SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_KEY')
    
    # Remover aspas se existirem
    if url and url.startswith('"') and url.endswith('"'):
        url = url[1:-1]
    if service_key and service_key.startswith('"') and service_key.endswith('"'):
        service_key = service_key[1:-1]
    
    # Remover comentários se existirem
    if url and '#' in url:
        url = url.split('#')[0].strip()
    if service_key and '#' in service_key:
        service_key = service_key.split('#')[0].strip()
    
    # Debug: mostrar valores das variáveis
    print(f"Debug - SUPABASE_URL: {url}")
    print(f"Debug - SUPABASE_SERVICE_KEY: {service_key[:20] if service_key else 'None'}...")
    
    if not url or not service_key:
        print("❌ Erro: SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar definidas no .env")
        print("Variáveis encontradas:")
        print(f"  SUPABASE_URL: {'✓' if url else '✗'}")
        print(f"  SUPABASE_SERVICE_KEY: {'✓' if service_key else '✗'}")
        sys.exit(1)
    
    # Validar se a URL está no formato correto
    if not url.startswith('https://') or not url.endswith('.supabase.co'):
        print(f"❌ Erro: URL do Supabase inválida: {url}")
        print("A URL deve estar no formato: https://[project-id].supabase.co")
        sys.exit(1)
    
    return create_client(url, service_key)

def execute_sql_file(supabase: Client, file_path: Path):
    """Executa um arquivo SQL no Supabase usando conexão direta"""
    import psycopg2
    
    try:
        print(f"📄 Executando: {file_path.name}")
        
        # Lê o conteúdo do arquivo SQL
        with open(file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Conecta diretamente ao PostgreSQL
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            print("❌ DATABASE_URL não encontrada")
            return False
        
        # Remove aspas se existirem
        if database_url.startswith('"') and database_url.endswith('"'):
            database_url = database_url[1:-1]
        
        print(f"  Conectando ao banco: {database_url[:50]}...")
        
        with psycopg2.connect(database_url) as conn:
            with conn.cursor() as cursor:
                # Executa o SQL completo
                cursor.execute(sql_content)
                conn.commit()
                print(f"  ✓ SQL executado com sucesso")
        
        print(f"✓ Arquivo {file_path.name} processado")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao executar {file_path.name}: {e}")
        return False

def main():
    """Função principal"""
    print("🚀 Iniciando execução de migrações...")
    
    # Carrega variáveis de ambiente
    load_environment()
    
    # Cria cliente Supabase
    supabase = get_supabase_client()
    
    # Diretório de migrações
    migrations_dir = Path(__file__).parent.parent / 'database' / 'migrations'
    
    if not migrations_dir.exists():
        print(f"❌ Diretório de migrações não encontrado: {migrations_dir}")
        sys.exit(1)
    
    # Lista arquivos SQL na pasta de migrações
    sql_files = sorted(migrations_dir.glob('*.sql'))
    
    if not sql_files:
        print(f"⚠️  Nenhum arquivo SQL encontrado em: {migrations_dir}")
        sys.exit(0)
    
    print(f"📁 Encontrados {len(sql_files)} arquivo(s) de migração:")
    for file in sql_files:
        print(f"  - {file.name}")
    
    # Executa cada arquivo de migração
    success_count = 0
    for sql_file in sql_files:
        if execute_sql_file(supabase, sql_file):
            success_count += 1
    
    print(f"\n📊 Resultado:")
    print(f"  ✓ Sucessos: {success_count}")
    print(f"  ❌ Falhas: {len(sql_files) - success_count}")
    
    if success_count == len(sql_files):
        print("🎉 Todas as migrações foram executadas com sucesso!")
    else:
        print("⚠️  Algumas migrações falharam. Verifique os logs acima.")

if __name__ == "__main__":
    main()
