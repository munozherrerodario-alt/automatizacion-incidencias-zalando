# 📦 Automatización de Incidencias - Zalando AI

> **Práctica 1 — Caso Troncal y Mapa AS-IS → TO-BE**  
> *Gestión de incidencias de entrega fallida con solicitud de devolución o reenvío mediante Inteligencia Artificial.*

[![IA](https://img.shields.io/badge/IA-Gemini%2FQwen-8E75B2)](https://ai.google.dev/)
[![Proceso](https://img.shields.io/badge/Proceso-AS--IS%20%E2%86%92%20TO--BE-blue)](#)
[![Valor](https://img.shields.io/badge/Valor-Alto-green)](#)
[![Complejidad](https://img.shields.io/badge/Complejidad-Media-yellow)](#)
[![Licencia](https://img.shields.io/badge/License-Academic-green)](#)

---

## 📖 Descripción del Proyecto

Este repositorio contiene el desarrollo de la **Práctica 1** del módulo de *Automatización con Inteligencia Artificial*. El objetivo es transformar el proceso **manual y reactivo** de gestión de incidencias de entrega fallida de Zalando en un flujo **automatizado, inteligente y trazable**, manteniendo el control humano en casos críticos o sensibles.

La propuesta integra extracción de datos con IA, clasificación automática, creación de tickets en CRM y rutas de derivación estratégica, reduciendo tiempos de respuesta y mejorando la satisfacción del cliente.

---

##  Matriz de Evaluación Rápida

| Dimensión | Valoración | Justificación |
|-----------|------------|---------------|
| 💎 **Valor** | Alto | Impacto directo en satisfacción del cliente y reducción de costes operativos |
| ⚠️ **Riesgo** | Medio | Proceso sensible pero bien delimitado dentro de la política comercial |
| 📁 **Datos** | Disponibles | Email/formulario, sistema de pedidos y CRM con histórico accesible |
| ⚙️ **Complejidad** | Media | Múltiples rutas de decisión, pero con lógica de negocio clara y estructurada |

---

## 🗺️ Mapa de Procesos: AS-IS → TO-BE

### 🔴 Estado Actual (AS-IS)
Proceso 100% manual y secuencial. El agente gestiona cada incidencia de principio a fin sin soporte automatizado, generando cuellos de botella, inconsistencias y tiempos de respuesta elevados.

### 🟢 Estado Futuro (TO-BE)
```mermaid
graph TD
    A[Cliente envía email/formulario] --> B{IA: Extracción y Validación}
    B -->|Datos completos y caso estándar| C[Ruta OK]
    B -->|Datos incompletos/ambiguo/sensible| D[Ruta Revisión]
    B -->|Fallo técnico o timeout| E[Ruta Error]
    
    C --> C1[Clasificación automática]
    C1 --> C2[Creación ticket CRM + etiquetas]
    C2 --> C3[Disparo acción: devolución/reenvío]
    C3 --> C4[Respuesta automática al cliente]
    
    D --> D1[Solicitud automática de info faltante]
    D1 --> D2[Cola de revisión humana]
    D2 --> D3[Agente valida y decide]
    
    E --> E1[Reintento automático]
    E1 -->|Persiste error| E2[Alerta a operaciones]
    E2 --> E3[Ticket temporal de contingencia]
    E3 --> E4[Reanudación al restaurar servicio]
