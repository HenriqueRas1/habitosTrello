# Habit Tracker 📋✅

Aplicativo de rastreamento de hábitos diários, estilo Trello. Funciona como PWA (pode instalar no celular).

**URL de Produção:** https://habitostrellohas.netlify.app/

---

## 🎯 Funcionalidades

- ✅ Login com Google
- ✅ Criar hábitos por dia da semana
- ✅ Marcar hábitos como "feito"
- ✅ Checklist dentro de cada hábito
- ✅ Arrastar e soltar para reordenar
- ✅ Editar nome e cor dos hábitos
- ✅ Sincronização em tempo real (Firebase)
- ✅ PWA - instalar no celular como app
- ✅ Interface mobile com swipe entre dias

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| React | Frontend |
| Vite | Build tool |
| Tailwind CSS | Estilos |
| Firebase Auth | Login com Google |
| Firestore | Banco de dados |
| Vite PWA Plugin | Progressive Web App |
| Netlify | Hospedagem |

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Board/
│   │   ├── Board.jsx        # Tela principal com grid de dias
│   │   └── DayColumn.jsx    # Coluna de cada dia
│   ├── Forms/
│   │   └── AddHabitForm.jsx # Modal para criar hábito
│   ├── HabitCard/
│   │   ├── HabitCard.jsx    # Card do hábito
│   │   └── HabitModal.jsx   # Modal de detalhes/edição
│   └── UI/
│       └── ColorPicker.jsx  # Seletor de cores
├── contexts/
│   └── AuthContext.jsx      # Contexto de autenticação
├── hooks/
│   ├── useHabits.js         # CRUD de hábitos (Firestore)
│   └── useCompletions.js    # Status de conclusão (Firestore)
├── lib/
│   ├── firebase.js          # Configuração Firebase
│   └── weekUtils.js         # Funções de data/semana
├── App.jsx                  # Componente raiz
├── main.jsx                 # Entry point
└── index.css                # Estilos globais
```

---

## 🔥 Firebase

### Configuração
O arquivo `src/lib/firebase.js` contém as credenciais do projeto.

### Firestore Rules (Segurança)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Estrutura dos Dados
```
users/
└── {userId}/
    ├── habits: [
    │   {
    │     id: "uuid",
    │     title: "Beber água",
    │     color: "#3B82F6",
    │     days: ["monday", "wednesday"],
    │     checklistTemplate: [{ id: "uuid", label: "8 copos" }],
    │     order: 0,
    │     createdAt: "2026-01-29T..."
    │   }
    │ ]
    └── completions: {
          "2026-W05": {
            "{habitId}": {
              "monday": ["checklistItemId1"],
              "doneStatus": { "monday": true }
            }
          }
        }
```

---

## 💻 Rodar Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 🚀 Deploy (Netlify)

1. Push para o GitHub
2. Conectar repositório no Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Domínios Autorizados (Firebase)
Adicionar em Firebase Console → Authentication → Settings → Authorized domains:
- `habitostrellohas.netlify.app`
- `localhost`

---

## 📱 Instalar no iPhone

1. Abrir o site no Safari
2. Tocar no botão Compartilhar (↑)
3. Selecionar "Adicionar à Tela de Início"
4. Confirmar

---

## 🔒 Segurança

1. **Firestore Rules** - Cada usuário só acessa seus dados
2. **API Key restrita** - Funciona apenas nos domínios autorizados (configurar no Google Cloud Console)
3. **Autenticação obrigatória** - Precisa login para usar

---

## 📅 Comportamento por Semana

- **Hábitos:** Persistem para sempre
- **Progresso:** Cada semana começa zerada
- **Histórico:** Fica salvo no Firebase

---

## 🎨 Cores Disponíveis

| Cor | Hex |
|-----|-----|
| Azul | #3B82F6 |
| Verde | #10B981 |
| Roxo | #8B5CF6 |
| Rosa | #EC4899 |
| Laranja | #F97316 |
| Amarelo | #EAB308 |
| Vermelho | #EF4444 |
| Cinza | #6B7280 |
