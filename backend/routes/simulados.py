"""
Simulai OAB - Rotas para Simulados
Endpoints para gerenciamento de simulados com suporte a paginação
"""

from fastapi import APIRouter, Query, Path, HTTPException, Depends
from typing import List, Optional
import math
from datetime import datetime

from models.simulados import (
    SimuladoDisponivel,
    SimuladoRealizado,
    SimuladoCreate,
    SimuladoSubmit,
    PaginationMeta,
    PaginatedResponse
)

# Dados mockados para desenvolvimento (serão substituídos por banco de dados)
SIMULADOS_DISPONIVEIS = [
    {
        "id": 1,
        "titulo": "Simulado OAB XXXVII - 1ª Fase",
        "tipo": "Prova Real",
        "questoes": 80,
        "tempo": 300,
        "disciplinas": ["Todas as disciplinas"],
        "participantes": 2847,
        "dificuldade": "Oficial",
        "status": "Disponível",
        "descricao": "Simulado completo nos moldes da prova oficial da OAB"
    },
    {
        "id": 2,
        "titulo": "Simulado Direito Constitucional",
        "tipo": "Customizado",
        "questoes": 20,
        "tempo": 60,
        "disciplinas": ["Direito Constitucional"],
        "participantes": 1523,
        "dificuldade": "Média",
        "status": "Disponível",
        "descricao": "Foco em princípios constitucionais e direitos fundamentais"
    },
    {
        "id": 3,
        "titulo": "Simulado 2ª Fase - Penal",
        "tipo": "Discursiva",
        "questoes": 4,
        "tempo": 300,
        "disciplinas": ["Direito Penal", "Processo Penal"],
        "participantes": 892,
        "dificuldade": "Difícil",
        "status": "Disponível",
        "descricao": "Peças processuais e questões discursivas de direito penal"
    },
    {
        "id": 4,
        "titulo": "Simulado Direito Administrativo",
        "tipo": "Customizado",
        "questoes": 25,
        "tempo": 75,
        "disciplinas": ["Direito Administrativo"],
        "participantes": 1245,
        "dificuldade": "Média",
        "status": "Disponível",
        "descricao": "Questões sobre princípios e atos administrativos"
    },
    {
        "id": 5,
        "titulo": "Simulado Direito Tributário",
        "tipo": "Customizado",
        "questoes": 20,
        "tempo": 60,
        "disciplinas": ["Direito Tributário"],
        "participantes": 987,
        "dificuldade": "Difícil",
        "status": "Disponível",
        "descricao": "Foco em tributos federais e competências tributárias"
    },
    {
        "id": 6,
        "titulo": "Simulado Direito do Trabalho",
        "tipo": "Customizado",
        "questoes": 30,
        "tempo": 90,
        "disciplinas": ["Direito do Trabalho"],
        "participantes": 1432,
        "dificuldade": "Média",
        "status": "Disponível",
        "descricao": "Questões sobre CLT e reforma trabalhista"
    },
    {
        "id": 7,
        "titulo": "Simulado Direito Civil Completo",
        "tipo": "Customizado",
        "questoes": 40,
        "tempo": 120,
        "disciplinas": ["Direito Civil"],
        "participantes": 1876,
        "dificuldade": "Média",
        "status": "Disponível",
        "descricao": "Abrange todos os livros do Código Civil"
    },
    {
        "id": 8,
        "titulo": "Simulado Direito Empresarial",
        "tipo": "Customizado",
        "questoes": 20,
        "tempo": 60,
        "disciplinas": ["Direito Empresarial"],
        "participantes": 765,
        "dificuldade": "Média",
        "status": "Disponível",
        "descricao": "Foco em sociedades empresariais e títulos de crédito"
    },
    {
        "id": 9,
        "titulo": "Simulado Ética Profissional",
        "tipo": "Customizado",
        "questoes": 15,
        "tempo": 45,
        "disciplinas": ["Ética Profissional"],
        "participantes": 2134,
        "dificuldade": "Fácil",
        "status": "Disponível",
        "descricao": "Questões sobre o Estatuto da OAB e Código de Ética"
    },
    {
        "id": 10,
        "titulo": "Simulado Direito Processual Civil",
        "tipo": "Customizado",
        "questoes": 30,
        "tempo": 90,
        "disciplinas": ["Direito Processual Civil"],
        "participantes": 1342,
        "dificuldade": "Difícil",
        "status": "Disponível",
        "descricao": "Foco no novo CPC e procedimentos especiais"
    }
]

SIMULADOS_REALIZADOS = [
    {
        "id": 1,
        "titulo": "Simulado OAB XXXVI - 1ª Fase",
        "dataRealizacao": "2024-01-15",
        "nota": 68,
        "acertos": 54,
        "total": 80,
        "tempo": 245,
        "posicao": 127,
        "totalParticipantes": 2156
    },
    {
        "id": 2,
        "titulo": "Simulado Direito Civil",
        "dataRealizacao": "2024-01-10",
        "nota": 85,
        "acertos": 17,
        "total": 20,
        "tempo": 45,
        "posicao": 23,
        "totalParticipantes": 1834
    },
    {
        "id": 3,
        "titulo": "Simulado Direito Penal",
        "dataRealizacao": "2024-01-05",
        "nota": 72,
        "acertos": 18,
        "total": 25,
        "tempo": 62,
        "posicao": 45,
        "totalParticipantes": 1567
    },
    {
        "id": 4,
        "titulo": "Simulado Direito Constitucional",
        "dataRealizacao": "2023-12-28",
        "nota": 90,
        "acertos": 18,
        "total": 20,
        "tempo": 52,
        "posicao": 12,
        "totalParticipantes": 1923
    },
    {
        "id": 5,
        "titulo": "Simulado Direito Administrativo",
        "dataRealizacao": "2023-12-20",
        "nota": 76,
        "acertos": 19,
        "total": 25,
        "tempo": 68,
        "posicao": 34,
        "totalParticipantes": 1432
    },
    {
        "id": 6,
        "titulo": "Simulado Ética Profissional",
        "dataRealizacao": "2023-12-15",
        "nota": 93,
        "acertos": 14,
        "total": 15,
        "tempo": 32,
        "posicao": 5,
        "totalParticipantes": 2134
    }
]

router = APIRouter(
    prefix="/api/v1/simulados",
    tags=["simulados"],
    responses={404: {"description": "Not found"}},
)

def paginate_data(data, page: int, limit: int):
    """Função auxiliar para paginar dados"""
    start = (page - 1) * limit
    end = start + limit
    
    # Dados paginados
    paginated_items = data[start:end]
    
    # Metadados de paginação
    total_items = len(data)
    total_pages = math.ceil(total_items / limit)
    
    meta = PaginationMeta(
        currentPage=page,
        totalPages=total_pages,
        totalItems=total_items,
        itemsPerPage=limit,
        hasNextPage=(end < total_items),
        hasPrevPage=(page > 1)
    )
    
    return paginated_items, meta

@router.get("/disponiveis", response_model=PaginatedResponse[SimuladoDisponivel])
async def get_simulados_disponiveis(
    page: int = Query(1, ge=1, description="Página atual"),
    limit: int = Query(10, ge=1, le=100, description="Itens por página")
):
    """
    Retorna simulados disponíveis com paginação
    
    - **page**: Número da página (começa em 1)
    - **limit**: Número de itens por página (máximo 100)
    """
    items, meta = paginate_data(SIMULADOS_DISPONIVEIS, page, limit)
    return PaginatedResponse(data=items, meta=meta)

@router.get("/realizados", response_model=PaginatedResponse[SimuladoRealizado])
async def get_simulados_realizados(
    page: int = Query(1, ge=1, description="Página atual"),
    limit: int = Query(10, ge=1, le=100, description="Itens por página")
):
    """
    Retorna simulados realizados pelo usuário com paginação
    
    - **page**: Número da página (começa em 1)
    - **limit**: Número de itens por página (máximo 100)
    """
    # Em um cenário real, filtraríamos pelo ID do usuário autenticado
    items, meta = paginate_data(SIMULADOS_REALIZADOS, page, limit)
    return PaginatedResponse(data=items, meta=meta)

@router.get("/{simulado_id}", response_model=SimuladoDisponivel)
async def get_simulado(
    simulado_id: int = Path(..., ge=1, description="ID do simulado")
):
    """
    Retorna detalhes de um simulado específico
    
    - **simulado_id**: ID do simulado
    """
    for simulado in SIMULADOS_DISPONIVEIS:
        if simulado["id"] == simulado_id:
            return simulado
    
    raise HTTPException(status_code=404, detail="Simulado não encontrado")

@router.post("/iniciar/{simulado_id}")
async def iniciar_simulado(
    simulado_id: int = Path(..., ge=1, description="ID do simulado")
):
    """
    Inicia um simulado para o usuário
    
    - **simulado_id**: ID do simulado a ser iniciado
    """
    # Verificar se o simulado existe
    simulado = None
    for s in SIMULADOS_DISPONIVEIS:
        if s["id"] == simulado_id:
            simulado = s
            break
    
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado")
    
    # Em um cenário real, criaríamos um registro de simulado em andamento para o usuário
    return {
        "message": "Simulado iniciado com sucesso",
        "simulado_id": simulado_id,
        "titulo": simulado["titulo"],
        "tempo_limite": simulado["tempo"],
        "questoes": simulado["questoes"],
        "iniciado_em": datetime.now().isoformat()
    }

@router.post("/submeter")
async def submeter_simulado(submission: SimuladoSubmit):
    """
    Submete as respostas de um simulado
    
    - **submission**: Dados da submissão do simulado
    """
    # Em um cenário real, processaríamos as respostas e calcularíamos a nota
    
    # Simulando uma nota calculada
    nota = 75  # Exemplo de nota
    
    return {
        "message": "Simulado submetido com sucesso",
        "simulado_id": submission.simulado_id,
        "nota": nota,
        "tempo_gasto": submission.tempo_gasto,
        "submetido_em": datetime.now().isoformat()
    }
