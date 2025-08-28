const adminMiddleware = (req, res, next) => {
  // Este middleware deve rodar DEPOIS do authMiddleware.
  // Por isso, já temos acesso a 'req.user' que foi decodificado do token.
  
  if (req.user && req.user.isAdmin) {
    // Se o usuário existe E a propriedade 'isAdmin' é verdadeira,
    // ele pode prosseguir.
    next();
  } else {
    // Caso contrário, retornamos um erro '403 Forbidden',
    // que significa que o usuário está autenticado, mas não tem permissão.
    res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador.' });
  }
};

module.exports = adminMiddleware;