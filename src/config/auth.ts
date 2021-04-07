export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || 'comprameucocoporquequempoucocococomprapoucocococome',
    expiresIn: '1d'
  }
}
