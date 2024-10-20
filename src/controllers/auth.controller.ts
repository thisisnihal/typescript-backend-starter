import { Request, Response } from 'express';
import { ApiError, ApiResponse, asyncHandler } from '@util/apiResponse.util';
import User, { IUser } from '@models/user.model';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const avatarFile = (req.files as Express.Multer.File[])?.[0];

    console.log('Avatar file:', avatarFile);

    console.log(email, password);

    if (!email || !password) throw new ApiError(400, "Email and password are required : )");

    res.status(200).json(new ApiResponse(200, { email }, 'Registered Successfully!'));
});

export const googleOAuthCallback = asyncHandler(async (req:Request, res:Response) => {
    const tempUser = req.user as IUser;
    console.log("tempUser: ", tempUser);
    const user = await User.findById(tempUser.id);
    if (!user) {
      throw new ApiError(401, "token expired sign in again");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.save();
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
    res.redirect(`/`);
  });