import jwt from 'jsonwebtoken';

export default function generateTokens(user) {
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}