import { StatusCodes } from 'http-status-codes';

export const register = async (req, res) => {
  const { email, name, lastName, password } = req.body;

  if (!name || !lastName || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please fill in all the required fields" });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please fill in all the required fields" });
    } 
  };

export const logout = async (req, res) => {
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: 'true',
    });
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  };
