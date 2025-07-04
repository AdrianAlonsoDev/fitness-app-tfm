# 10. Chat Asistente con OpenAI

## 🎯 Objetivo
Implementar un chat flotante persistente que se conecte con OpenAI para crear un asistente virtual de fitness. El chat aparecerá en todas las rutas del dashboard y será colapsable.

## 📋 Pre-requisitos
- Tener el proyecto funcionando (Frontend + Backend)
- Cuenta en OpenAI con créditos disponibles
- Conocimientos básicos de React y TypeScript

## 🔑 Configuración de OpenAI

### Paso 1: Obtener API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com)
2. Inicia sesión o crea una cuenta
3. Ve a **API Keys** en el menú lateral
4. Haz clic en **Create new secret key**
5. Dale un nombre como "Fitness App Chat"
6. **IMPORTANTE**: Copia la clave inmediatamente (no podrás verla de nuevo)

### Paso 2: Configurar la API Key en el proyecto

1. Abre el archivo `.env` en la carpeta `frontend`
2. Añade tu API key:

```env
# OpenAI API Key para Chat Asistente
# Obtén tu clave en: https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=tu-api-key-aqui
```

⚠️ **IMPORTANTE**: 
- Nunca subas tu API key a GitHub
- Añade `.env` a tu `.gitignore` si no está ya

## 🚀 Implementación

### Paso 1: Crear el servicio de chat

Crea un nuevo archivo para manejar la comunicación con OpenAI:

**frontend/src/services/chatService.ts**

```typescript
// Interfaz para los mensajes del chat
interface ChatMessage {
  role: 'system' | 'user' | 'assistant'  // Tipos de rol en la conversación
  content: string                         // Contenido del mensaje
}

// Interfaz para la respuesta de OpenAI
interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string  // Respuesta generada por el modelo
    }
  }>
}

// Clase para manejar toda la comunicación con OpenAI
class ChatService {
  private apiKey: string

  constructor() {
    // Obtiene la API key de las variables de entorno
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
  }

  // Método principal para enviar mensajes y recibir respuestas
  async sendMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // Verifica que tengamos una API key configurada
    if (!this.apiKey) {
      throw new Error('La clave API de OpenAI no está configurada. Por favor añade VITE_OPENAI_API_KEY a tu archivo .env.')
    }

    // Construye el array de mensajes para enviar a OpenAI
    const messages: ChatMessage[] = [
      {
        role: 'system',
        // Este es el prompt del sistema que define la personalidad del asistente
        content: 'Eres un asistente de fitness amigable. Ayuda a los usuarios con sus preguntas sobre fitness, nutrición y bienestar. Mantén las respuestas concisas, amigables y enfocadas en temas de salud y fitness. Responde siempre en español.'
      },
      ...conversationHistory,  // Incluye el historial de conversación
      {
        role: 'user',
        content: userMessage    // El mensaje actual del usuario
      }
    ]

    try {
      // Hace la petición a la API de OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`  // Autenticación con la API key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',     // Modelo a usar (más económico)
          messages,                    // Array de mensajes
          temperature: 0.7,            // Creatividad (0-1, mayor = más creativo)
          max_tokens: 500,             // Límite de tokens en la respuesta
          n: 1                         // Número de respuestas a generar
        })
      })

      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al obtener respuesta de OpenAI')
      }

      // Extrae la respuesta del modelo
      const data: ChatCompletionResponse = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('ChatService error:', error)
      throw error  // Re-lanza el error para manejarlo en el componente
    }
  }
}

// Exporta una instancia única del servicio (patrón Singleton)
export const chatService = new ChatService()
export type { ChatMessage }
```

### Paso 2: Crear el componente FloatingChat

Crea la carpeta y el componente del chat:

**frontend/src/components/FloatingChat/FloatingChat.tsx**

```typescript
import React, { useState, useRef, useEffect } from 'react'
import {
  Fab,
  Paper,
  Box,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Fade,
  Zoom
} from '@mui/material'
import { Iconify } from '../../utils/iconify'
import { chatService, type ChatMessage } from '../../services/chatService'

// Interfaz para los mensajes en el componente
interface Message {
  id: string                    // ID único para cada mensaje
  role: 'user' | 'assistant'    // Quién envió el mensaje
  content: string               // Contenido del mensaje
  timestamp: Date               // Cuándo se envió
}

export const FloatingChat: React.FC = () => {
  // Estados del componente
  const [isOpen, setIsOpen] = useState(false)              // Controla si el chat está abierto
  const [messages, setMessages] = useState<Message[]>([])   // Array de mensajes
  const [inputMessage, setInputMessage] = useState('')      // Texto del input
  const [isLoading, setIsLoading] = useState(false)         // Indicador de carga
  const [error, setError] = useState<string | null>(null)   // Mensajes de error
  const messagesEndRef = useRef<HTMLDivElement>(null)       // Ref para scroll automático

  // Función para hacer scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Efecto para hacer scroll cuando hay nuevos mensajes
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Función principal para enviar mensajes
  const handleSendMessage = async () => {
    // No enviar si el mensaje está vacío
    if (!inputMessage.trim()) return

    // Crear objeto del mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    // Actualizar el estado: añadir mensaje, limpiar input, mostrar loading
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError(null)

    try {
      // Convertir historial al formato que espera el servicio
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Llamar al servicio de OpenAI
      const response = await chatService.sendMessage(inputMessage, conversationHistory)

      // Crear mensaje de respuesta del asistente
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      // Añadir respuesta al chat
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      // Manejar errores mostrando un mensaje
      setError(error instanceof Error ? error.message : 'Error al enviar mensaje')
    } finally {
      // Siempre ocultar el indicador de carga
      setIsLoading(false)
    }
  }

  // Manejar envío con Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Botón flotante - Solo visible cuando el chat está cerrado */}
      <Zoom in={!isOpen}>
        <Fab
          color="primary"
          aria-label="abrir chat"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1200,
            // Gradiente personalizado para el botón
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            '&:hover': {
              // Invierte el gradiente al hacer hover
              background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)'
            }
          }}
        >
          <Iconify icon='solar:chat-round-dots-bold-duotone' width={24} />
        </Fab>
      </Zoom>

      {/* Ventana de chat - Solo visible cuando isOpen es true */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            // Responsivo: pantalla completa en móvil, 380px en desktop
            width: { xs: 'calc(100% - 48px)', sm: 380 },
            height: { xs: 'calc(100% - 48px)', sm: 500 },
            maxWidth: 380,
            maxHeight: 600,
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            zIndex: 1200,    // Asegura que esté por encima de otros elementos
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Header del chat con título y botones de control */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Asistente Fitness
            </Typography>
            <Box>
              {/* Botón de minimizar - solo cierra la ventana */}
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: 'white' }}
              >
                <Iconify icon='solar:minimize-square-minimalistic-bold-duotone' width={20} />
              </IconButton>
              {/* Botón de cerrar - cierra y limpia la conversación */}
              <IconButton
                size="small"
                onClick={() => {
                  setIsOpen(false)
                  setMessages([])      // Limpia todos los mensajes
                  setError(null)       // Limpia errores
                }}
                sx={{ color: 'white', ml: 0.5 }}
              >
                <Iconify icon='solar:close-square-bold-duotone' width={20} />
              </IconButton>
            </Box>
          </Box>

          <Divider />

          {/* Área de mensajes - donde se muestran las conversaciones */}
          <Box
            sx={{
              flex: 1,              // Ocupa todo el espacio disponible
              overflowY: 'auto',    // Scroll vertical cuando hay muchos mensajes
              p: 2,
              bgcolor: '#f5f5f5'
            }}
          >
            {/* Mensaje de bienvenida cuando no hay conversación */}
            {messages.length === 0 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  ¡Hola! Soy tu asistente de fitness. Pregúntame cualquier cosa sobre entrenamientos, nutrición o bienestar!
                </Typography>
              </Box>
            )}

            {/* Lista de mensajes */}
            <List sx={{ p: 0 }}>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    p: 0,
                    mb: 2,
                    display: 'flex',
                    // Alinea mensajes del usuario a la derecha, del asistente a la izquierda
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '75%',    // Limita el ancho del mensaje
                      p: 1.5,
                      borderRadius: 2,
                      // Color diferente para usuario y asistente
                      bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                      boxShadow: 1
                    }}
                  >
                    <ListItemText
                      primary={message.content}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.875rem',
                          whiteSpace: 'pre-wrap'  // Respeta saltos de línea
                        }
                      }}
                    />
                  </Box>
                </ListItem>
              ))}
              {/* Indicador de carga mientras espera respuesta */}
              {isLoading && (
                <ListItem sx={{ p: 0, display: 'flex', justifyContent: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      Pensando...
                    </Typography>
                  </Box>
                </ListItem>
              )}
            </List>
            {/* Div invisible para hacer scroll automático */}
            <div ref={messagesEndRef} />
          </Box>

          {/* Alerta de error - se muestra cuando hay problemas con la API */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}  // Botón X para cerrar el error
              sx={{ mx: 2, mb: 1 }}
            >
              {error}
            </Alert>
          )}

          <Divider />

          {/* Área de entrada de texto */}
          <Box sx={{ p: 2, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Escribe tu mensaje..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}          // Permite enviar con Enter
                disabled={isLoading}                 // Desactiva durante carga
                multiline                            // Permite múltiples líneas
                maxRows={3}                          // Máximo 3 líneas visibles
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              {/* Botón de enviar */}
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}  // Desactiva si está cargando o vacío
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  },
                  '&:disabled': {
                    bgcolor: 'action.disabledBackground'
                  }
                }}
              >
                <Iconify icon='solar:arrow-right-up-bold-duotone' width={20} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  )
}
```

### Paso 3: Integrar el chat en el Dashboard

Ahora necesitas añadir el componente FloatingChat al layout del dashboard para que aparezca en todas las rutas.

**frontend/src/layouts/dashboard/layout.tsx**

1. Primero, importa el componente al inicio del archivo:

```typescript
// Importa el componente del chat flotante
import { FloatingChat } from '../../components/FloatingChat/FloatingChat'
```

2. Luego, añade el componente antes del cierre del `LayoutSection` (justo después de `</MainSection>`):

```typescript
      </MainSection>
      {/* Añade el chat flotante que aparecerá en todas las páginas */}
      <FloatingChat />
    </LayoutSection>
  )
}
```

## ✅ ¡Listo!

Tu aplicación ahora tiene:
- Un chat flotante en todas las páginas del dashboard
- Integración con OpenAI para respuestas inteligentes
- Interfaz en español
- Historial de conversación (solo durante la sesión)
- Diseño responsivo y colapsable

## 🧪 Cómo probarlo

1. **Configuración**:
   - Asegúrate de tener tu API key en el archivo `.env`
   - Reinicia el servidor de desarrollo (`npm run dev`)

2. **Probar el chat**:
   - Ve a cualquier página del dashboard
   - Haz clic en el botón flotante morado en la esquina inferior derecha
   - Escribe preguntas como:
     - "¿Qué ejercicios recomiendas para principiantes?"
     - "¿Cuántas calorías debo consumir al día?"
     - "Dame una rutina de 3 días para ganar músculo"

3. **Verificar funcionalidad**:
   - El chat debe responder en español
   - Los mensajes deben aparecer con diferentes colores (usuario/asistente)
   - El botón de minimizar debe colapsar el chat
   - El botón de cerrar debe limpiar la conversación

## ⚠️ Solución de problemas

### Error: "La clave API de OpenAI no está configurada"
- Verifica que hayas añadido `VITE_OPENAI_API_KEY` en tu archivo `.env`
- Asegúrate de reiniciar el servidor después de añadir la variable

### Error 401: Unauthorized
- Tu API key puede ser incorrecta o estar inactiva
- Verifica en [OpenAI Platform](https://platform.openai.com) que tengas créditos disponibles

### Error 429: Rate limit exceeded
- Has excedido el límite de solicitudes
- Espera unos minutos o revisa tu plan en OpenAI

### El chat no aparece
- Verifica que hayas importado y añadido `<FloatingChat />` en el layout
- Revisa la consola del navegador por errores

## 💡 Tips y mejoras

### 1. Limitar el contexto de conversación

Para evitar costos excesivos, puedes limitar el historial:

```typescript
// En handleSendMessage, antes de llamar al servicio:
const conversationHistory: ChatMessage[] = messages
  .slice(-10) // Toma solo los últimos 10 mensajes para reducir tokens
  .map(msg => ({
    role: msg.role,
    content: msg.content
  }))
```

### 2. Personalizar el asistente

Puedes cambiar la personalidad del asistente modificando el system prompt:

```typescript
// En chatService.ts, modifica el mensaje del sistema:
{
  role: 'system',
  content: 'Eres un entrenador personal experto. Eres motivador pero estricto. Das consejos específicos y creas rutinas detalladas. Siempre preguntas sobre el nivel de experiencia antes de recomendar ejercicios.'
}
```

### 3. Añadir respuestas predefinidas

Para preguntas comunes, puedes añadir botones de respuesta rápida:

```typescript
// Define las preguntas frecuentes
const quickQuestions = [
  "¿Cómo empiezo a entrenar?",
  "¿Qué debo comer antes de entrenar?",
  "Dame una rutina para perder peso"
]

// En el componente FloatingChat, después del mensaje de bienvenida:
{messages.length === 0 && (
  <Box sx={{ mt: 2 }}>
    {quickQuestions.map((question) => (
      <Button
        key={question}
        size="small"
        variant="outlined"
        onClick={() => {
          setInputMessage(question)      // Establece la pregunta en el input
          handleSendMessage()             // Envía automáticamente
        }}
        sx={{ m: 0.5 }}
      >
        {question}
      </Button>
    ))}
  </Box>
)}
```

## 🎨 Personalización visual

### Cambiar colores del chat

Modifica los gradientes en el componente:

```typescript
// En el Fab (botón flotante)
background: 'linear-gradient(45deg, #TU_COLOR_1 30%, #TU_COLOR_2 90%)'

// En el Box del header
background: 'linear-gradient(45deg, #TU_COLOR_1 30%, #TU_COLOR_2 90%)'
```

### Cambiar posición

Para mover el chat a otra esquina:

```typescript
// Esquina inferior izquierda
sx={{
  position: 'fixed',
  bottom: 24,
  left: 24,  // Cambiar right por left
  // ...
}}
```
