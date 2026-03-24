/**
 * Translation System - Simple i18n implementation for Spanish and English.
 * Production-ready with type safety.
 */

export type Language = "es" | "en";

export const translations = {
  es: {
    // Navigation
    nav: {
      home: "Inicio",
      accounts: "Cuentas",
      services: "Servicios",
      profile: "Perfil",
    },
    
    // Dashboard
    dashboard: {
      greeting: "Hola",
      summary: "Aquí está tu resumen financiero de",
      totalBalance: "Balance Total",
      debt: "Deuda",
      available: "Disponible",
      monthlyServices: "Servicios Mensuales",
      monthlyRecurring: "Costo mensual recurrente de",
      upcomingPayments: "Próximos Pagos de",
      stayOnTop: "Mantente al día con tus compromisos",
      dueToday: "Vence hoy",
      dueTomorrow: "Vence mañana",
      inDays: "En {days} días",
      card: "Tarjeta",
      subscription: "Suscripción",
      bill: "Factura",
      acrossAccounts: "En todas tus cuentas a la fecha",
    },

    // Accounts
    accounts: {
      title: "Mis Cuentas",
      subtitle: "Gestiona tus tarjetas y cuentas bancarias",
      debit: "Débito",
      credit: "Crédito",
      totalBalance: "Balance Total en Cuentas",
      bankAccounts: "cuentas bancarias",
      available: "Disponible",
      used: "Usado",
      copyCCI: "Copiar CCI",
      copied: "¡Copiado!",
      accountNumber: "Número de Cuenta",
      lastUpdated: "Última actualización",
      default: "Predeterminada",
      addAccount: "Agregar Cuenta",
      addCard: "Agregar Tarjeta",
      noAccounts: "No hay cuentas aún",
      noCards: "No hay tarjetas de crédito",
      addFirst: "Agrega tu primera cuenta bancaria",
      addFirstCard: "Agrega tu primera tarjeta de crédito",
      confirmDelete: "¿Estás seguro de que deseas eliminar {name}? Esta acción no se puede deshacer.",
    },

    // Services
    services: {
      title: "Mis Servicios",
      subtitle: "Gestiona tus pagos recurrentes y servicios",
      totalMonthlyCost: "Costo Mensual Total",
      activeServices: "servicios activos",
      pendingPayments: "pago pendiente | pagos pendientes",
      thisWeek: "esta semana",
      monthly: "Mensual",
      yearly: "Anual",
      weekly: "Semanal",
      quarterly: "Trimestral",
      autoRenewal: "Auto-renovación",
      active: "Activo",
      cancelled: "Cancelado",
      paused: "Pausado",
      addService: "Agregar Servicio",
      noServices: "No hay servicios registrados",
      addFirstService: "Agrega tus servicios para gestionar pagos recurrentes",
      // Categories
      categoryEntertainment: "Entretenimiento",
      categoryProductivity: "Productividad",
      categoryHealth: "Salud y Fitness",
      categoryUtilities: "Servicios Básicos",
      categoryTelecom: "Telecomunicaciones",
      categoryHousing: "Vivienda",
    },

    // Profile
    profile: {
      title: "Mi Perfil",
      subtitle: "Gestiona tu cuenta y preferencias",
      personalInfo: "Información Personal",
      email: "Email",
      phone: "Teléfono",
      memberSince: "Miembro desde",
      notifications: "Configuración de Notificaciones",
      paymentReminders: "Recordatorios de Pago",
      paymentRemindersDesc: "Recibe alertas antes de vencimientos",
      balanceAlerts: "Alertas de Saldo",
      balanceAlertsDesc: "Notificación cuando el saldo sea bajo",
      transactionNotifications: "Notificaciones de Transacciones",
      transactionNotificationsDesc: "Alerta en cada movimiento",
      monthlySummary: "Resumen Mensual",
      monthlySummaryDesc: "Recibe un resumen al final del mes",
      appPreferences: "Preferencias de la App",
      theme: "Tema",
      themeLight: "Claro",
      themeDark: "Oscuro",
      themeSystem: "Sistema",
      language: "Idioma",
      languageSpanish: "Español",
      languageEnglish: "English",
      currency: "Moneda",
      currencyPEN: "Soles (PEN)",
      currencyUSD: "Dólares (USD)",
      currencyEUR: "Euros (EUR)",
      security: "Seguridad",
      changePassword: "Cambiar Contraseña",
      twoFactor: "Autenticación de Dos Factores",
      logout: "Cerrar Sesión",
      version: "WARDIA v1.0.0",
      copyright: "© 2026 - Personal Finance Manager",
    },

    // Credentials
    credentials: {
      title: "Credenciales Bancarias",
      accessCredentials: "Credenciales de acceso",
      username: "Usuario",
      password: "Contraseña",
      digitalKey: "Clave Digital",
      securityToken: "Token de Seguridad",
      notes: "Notas",
      optional: "Opcional",
      showHide: "Mostrar/Ocultar",
      copy: "Copiar",
      noCredentials: "No hay credenciales bancarias registradas",
      deleteTitle: "Eliminar Credenciales",
      deleteMessage: "¿Estás seguro de que deseas eliminar las credenciales de {bank}? Esta acción no se puede deshacer.",
      addCredentials: "Agregar Credenciales",
      editCredentials: "Editar Credenciales",
    },

    // Credit Card
    creditCard: {
      creditUsage: "Uso de Crédito",
      limit: "Límite",
      nextPayment: "Próximo Pago",
      minimum: "Mínimo",
      cutoffDate: "Fecha de Corte",
      day: "Día",
      ofMonth: "del mes",
      dueDay: "Vence: Día",
      lastUpdated: "Última actualización",
    },

    // Modals & Forms
    forms: {
      bankName: "Nombre del Banco",
      bankNamePlaceholder: "Ej: BCP, Interbank",
      bankNameRequired: "Nombre del banco requerido",
      usernamePlaceholder: "Tu usuario de acceso",
      usernameRequired: "Usuario requerido",
      passwordRequired: "Contraseña requerida",
      notesPlaceholder: "Información adicional...",
      accountType: "Tipo de Cuenta",
      accountTypeChecking: "Corriente",
      accountTypeSavings: "Ahorros",
      currentBalance: "Balance Actual",
      invalidBalance: "Balance inválido",
      accountNumberRequired: "Número de cuenta requerido",
      cciRequired: "CCI requerido",
      setAsDefault: "Establecer como cuenta predeterminada",
      cardholderName: "Nombre del Titular",
      cardholderNameRequired: "Nombre del titular requerido",
      cardNumber: "Número de Tarjeta",
      invalidCardNumber: "Número de tarjeta inválido",
      network: "Red",
      expiryMonth: "Mes de Expiración",
      expiryYear: "Año de Expiración",
      expiryRequired: "Fecha de expiración requerida",
      creditLimit: "Límite de Crédito",
      invalidCreditLimit: "Límite inválido",
      usedCredit: "Crédito Usado",
      invalidUsedCredit: "Crédito usado inválido",
      serviceName: "Nombre del Servicio",
      serviceNamePlaceholder: "Ej: Netflix Premium",
      nameRequired: "Nombre requerido",
      description: "Descripción",
      descriptionPlaceholder: "Detalles adicionales...",
      amount: "Monto",
      invalidAmount: "Monto inválido",
      frequency: "Frecuencia",
      nextPaymentDate: "Próximo Pago",
      dateRequired: "Fecha requerida",
      autoRenewal: "Auto-renovación",
      renewsAutomatically: "Se renueva automáticamente",
      category: "Categoría",
      update: "Actualizar",
      saveChanges: "Guardar Cambios",
      addAccount: "Agregar Cuenta",
      editAccount: "Editar Cuenta",
      addService: "Agregar Servicio",
      editService: "Editar Servicio",
    },

    // Common
    common: {
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      add: "Agregar",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      close: "Cerrar",
      confirm: "Confirmar",
      back: "Volver",
    },
  },
  
  en: {
    // Navigation
    nav: {
      home: "Home",
      accounts: "Accounts",
      services: "Services",
      profile: "Profile",
    },
    
    // Dashboard
    dashboard: {
      greeting: "Hello",
      summary: "Here's your financial summary for",
      totalBalance: "Total Balance",
      debt: "Debt",
      available: "Available",
      monthlyServices: "Monthly Services",
      monthlyRecurring: "Monthly recurring cost for",
      upcomingPayments: "Upcoming Payments for",
      stayOnTop: "Stay on top of your commitments",
      dueToday: "Due today",
      dueTomorrow: "Due tomorrow",
      inDays: "In {days} days",
      card: "Card",
      subscription: "Subscription",
      bill: "Bill",
      acrossAccounts: "Across all accounts to date",
    },

    // Accounts
    accounts: {
      title: "My Accounts",
      subtitle: "Manage your cards and bank accounts",
      debit: "Debit",
      credit: "Credit",
      totalBalance: "Total Balance in Accounts",
      bankAccounts: "bank accounts",
      available: "Available",
      used: "Used",
      copyCCI: "Copy CCI",
      copied: "Copied!",
      accountNumber: "Account Number",
      lastUpdated: "Last updated",
      default: "Default",
      addAccount: "Add Account",
      addCard: "Add Card",
      noAccounts: "No accounts yet",
      noCards: "No credit cards",
      addFirst: "Add your first bank account",
      addFirstCard: "Add your first credit card",
      confirmDelete: "Are you sure you want to delete {name}? This action cannot be undone.",
    },

    // Services
    services: {
      title: "My Services",
      subtitle: "Manage your recurring payments and services",
      totalMonthlyCost: "Total Monthly Cost",
      activeServices: "active services",
      pendingPayments: "pending payment | pending payments",
      thisWeek: "this week",
      monthly: "Monthly",
      yearly: "Yearly",
      weekly: "Weekly",
      quarterly: "Quarterly",
      autoRenewal: "Auto-renewal",
      active: "Active",
      cancelled: "Cancelled",
      paused: "Paused",
      addService: "Add Service",
      noServices: "No services registered",
      addFirstService: "Add your services to manage recurring payments",
      // Categories
      categoryEntertainment: "Entertainment",
      categoryProductivity: "Productivity",
      categoryHealth: "Health & Fitness",
      categoryUtilities: "Utilities",
      categoryTelecom: "Telecommunications",
      categoryHousing: "Housing",
    },

    // Profile
    profile: {
      title: "My Profile",
      subtitle: "Manage your account and preferences",
      personalInfo: "Personal Information",
      email: "Email",
      phone: "Phone",
      memberSince: "Member since",
      notifications: "Notification Settings",
      paymentReminders: "Payment Reminders",
      paymentRemindersDesc: "Receive alerts before due dates",
      balanceAlerts: "Balance Alerts",
      balanceAlertsDesc: "Notification when balance is low",
      transactionNotifications: "Transaction Notifications",
      transactionNotificationsDesc: "Alert on every transaction",
      monthlySummary: "Monthly Summary",
      monthlySummaryDesc: "Receive a summary at the end of the month",
      appPreferences: "App Preferences",
      theme: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      themeSystem: "System",
      language: "Language",
      languageSpanish: "Español",
      languageEnglish: "English",
      currency: "Currency",
      currencyPEN: "Soles (PEN)",
      currencyUSD: "Dollars (USD)",
      currencyEUR: "Euros (EUR)",
      security: "Security",
      changePassword: "Change Password",
      twoFactor: "Two-Factor Authentication",
      logout: "Sign Out",
      version: "WARDIA v1.0.0",
      copyright: "© 2026 - Personal Finance Manager",
    },

    // Credentials
    credentials: {
      title: "Bank Credentials",
      accessCredentials: "Access credentials",
      username: "Username",
      password: "Password",
      digitalKey: "Digital Key",
      securityToken: "Security Token",
      notes: "Notes",
      optional: "Optional",
      showHide: "Show/Hide",
      copy: "Copy",
      noCredentials: "No bank credentials registered",
      deleteTitle: "Delete Credentials",
      deleteMessage: "Are you sure you want to delete the credentials for {bank}? This action cannot be undone.",
      addCredentials: "Add Credentials",
      editCredentials: "Edit Credentials",
    },

    // Credit Card
    creditCard: {
      creditUsage: "Credit Usage",
      limit: "Limit",
      nextPayment: "Next Payment",
      minimum: "Minimum",
      cutoffDate: "Cut-off Date",
      day: "Day",
      ofMonth: "of month",
      dueDay: "Due: Day",
      lastUpdated: "Last updated",
    },

    // Modals & Forms
    forms: {
      bankName: "Bank Name",
      bankNamePlaceholder: "e.g. BCP, Interbank",
      bankNameRequired: "Bank name required",
      usernamePlaceholder: "Your access username",
      usernameRequired: "Username required",
      passwordRequired: "Password required",
      notesPlaceholder: "Additional information...",
      accountType: "Account Type",
      accountTypeChecking: "Checking",
      accountTypeSavings: "Savings",
      currentBalance: "Current Balance",
      invalidBalance: "Invalid balance",
      accountNumberRequired: "Account number required",
      cciRequired: "CCI required",
      setAsDefault: "Set as default account",
      cardholderName: "Cardholder Name",
      cardholderNameRequired: "Cardholder name required",
      cardNumber: "Card Number",
      invalidCardNumber: "Invalid card number",
      network: "Network",
      expiryMonth: "Expiry Month",
      expiryYear: "Expiry Year",
      expiryRequired: "Expiry date required",
      creditLimit: "Credit Limit",
      invalidCreditLimit: "Invalid limit",
      usedCredit: "Used Credit",
      invalidUsedCredit: "Invalid used credit",
      serviceName: "Service Name",
      serviceNamePlaceholder: "e.g. Netflix Premium",
      nameRequired: "Name required",
      description: "Description",
      descriptionPlaceholder: "Additional details...",
      amount: "Amount",
      invalidAmount: "Invalid amount",
      frequency: "Frequency",
      nextPaymentDate: "Next Payment",
      dateRequired: "Date required",
      autoRenewal: "Auto-renewal",
      renewsAutomatically: "Renews automatically",
      category: "Category",
      update: "Update",
      saveChanges: "Save Changes",
      addAccount: "Add Account",
      editAccount: "Edit Account",
      addService: "Add Service",
      editService: "Edit Service",
    },

    // Common
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      close: "Close",
      confirm: "Confirm",
      back: "Back",
    },
  },
} as const;

export type TranslationKeys = typeof translations.es;

/**
 * Get translation for a key in the specified language
 * Supports variable interpolation with {varName} syntax
 */
export function getTranslation(
  language: Language,
  path: string,
  variables?: Record<string, string | number>
): string {
  const keys = path.split(".");
  let value: unknown = translations[language];
  
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  
  let result = typeof value === "string" ? value : path;
  
  if (variables) {
    Object.entries(variables).forEach(([key, val]) => {
      result = result.replace(`{${key}}`, String(val));
    });
  }
  
  return result;
}

/**
 * Replace placeholders in translation strings
 */
export function interpolate(text: string, params: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}
