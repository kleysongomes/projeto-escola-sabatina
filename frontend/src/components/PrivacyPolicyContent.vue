<template>
  <div class="policy-text">
    <h2>1. Coleta de Dados</h2>
    <p>Coletamos as informações que você nos fornece diretamente no momento do cadastro, como nome de usuário, senha (armazenada de forma segura com hash), país, estado, cidade e igreja. Também coletamos as reviews que você escreve e suas interações (curtidas, reports).</p>
    
    <h2>2. Uso das Informações</h2>
    <p>As informações coletadas são usadas para o funcionamento da plataforma, incluindo o sistema de gamificação (pontos e ranking), exibição das reviews para a comunidade e moderação de conteúdo. Seu nome de usuário, cidade, país e igreja são visíveis publicamente no ranking.</p>
    
    <h2>3. Segurança dos Dados</h2>
    <p>Nos comprometemos a proteger seus dados. Senhas são criptografadas com `bcrypt` e nunca armazenadas em texto puro. A comunicação entre o aplicativo e o servidor é protegida com HTTPS/SSL.</p>

    </div>
</template>

<style scoped>
.policy-text h2 {
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--cor-texto);
}
.policy-text p {
  line-height: 1.7;
}
</style>