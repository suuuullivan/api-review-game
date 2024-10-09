import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database"; // Connexion à la base de données

export interface ReviewAttributes {
}

export class Review
  extends Model<ReviewAttributes>
  implements ReviewAttributes
{
}

Review.init(
  {},
  {
    sequelize,
    tableName: "reviews",
  }
);