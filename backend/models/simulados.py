"""
Simulai OAB - Modelos para Simulados
Define os modelos Pydantic para simulados e respostas paginadas
"""

from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel, Field
from datetime import datetime

# Tipo genérico para paginação
T = TypeVar('T')

class SimuladoDisponivel(BaseModel):
    """Modelo para simulados disponíveis"""
    id: int
    titulo: str
    tipo: str
    questoes: int
    tempo: int
    disciplinas: List[str]
    participantes: int
    dificuldade: str
    status: str
    descricao: str

class SimuladoRealizado(BaseModel):
    """Modelo para simulados realizados pelo usuário"""
    id: int
    titulo: str
    dataRealizacao: str
    nota: int
    acertos: int
    total: int
    tempo: int
    posicao: int
    totalParticipantes: int

class SimuladoCreate(BaseModel):
    """Modelo para criação de simulados"""
    titulo: str
    tipo: str
    questoes: int
    tempo: int
    disciplinas: List[str]
    dificuldade: str
    descricao: str

class SimuladoSubmit(BaseModel):
    """Modelo para submissão de respostas de simulado"""
    simulado_id: int
    respostas: dict
    tempo_gasto: int

class PaginationMeta(BaseModel):
    """Metadados de paginação"""
    currentPage: int
    totalPages: int
    totalItems: int
    itemsPerPage: int
    hasNextPage: bool
    hasPrevPage: bool

class PaginatedResponse(BaseModel, Generic[T]):
    """Resposta paginada genérica"""
    data: List[T]
    meta: PaginationMeta
