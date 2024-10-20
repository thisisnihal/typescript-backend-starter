import mongoose, { Document, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { conf } from "src/conf";

export enum ProviderType {
  LOCAL = "local",
  GOOGLE = "google",
  GITHUB = "github",
}
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  name: string;
  providerType: ProviderType;
  googleId?: string;
  githubId?: string;
  refreshToken?: string;
  isPasswordCorrect(plainPassword: string): Promise<boolean>;
  generateAccessToken: () =>string;
  generateRefreshToken: () =>string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    providerType: {
      type: String,
      enum: ProviderType,
      default: ProviderType.LOCAL,
      required: true,
    },
    googleId: { type: String, unique: true, sparse: true }, 
    githubId: { type: String, unique: true, sparse: true }, 
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password as string, salt);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  plainPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, this.password as string);
};


userSchema.methods.generateAccessToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email
    },
    conf.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: conf.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
    },
    conf.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: conf.REFRESH_TOKEN_EXPIRY,
    }
  );
};





const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
