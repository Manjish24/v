import jwt from 'jsonwebtoken';
import { memoryStore, supabase, isSupabaseConfigured } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-capacity-connect-secret-jwt-key-2026';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing or malformed.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    // Lookup user in memoryStore
    let user = memoryStore.users.find(u => u.id === decoded.userId);

    if (!user && isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();
      if (data && !error) user = data;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator.'
      });
    }

    if (user.status === 'REJECTED') {
      return res.status(403).json({
        success: false,
        message: 'Your account application has been rejected.'
      });
    }

    // Attach verified user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar_url: user.avatar_url
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
}
