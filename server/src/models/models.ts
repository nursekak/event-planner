import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

const Role = sequelize.define('role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
});

const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    deadline: { type: DataTypes.DATE, allowNull: false },
});

const Event = sequelize.define('event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    place: { type: DataTypes.STRING, allowNull: false },
    budget: { type: DataTypes.INTEGER, allowNull: false },
});

// Define join table models
const UserRole = sequelize.define('user_role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const UserEvent = sequelize.define('user_event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

Event.hasMany(Task);
Task.belongsTo(Event);

User.belongsToMany(Event, { through: UserEvent });
Event.belongsToMany(User, { through: UserEvent });

Role.belongsToMany(User, { through: UserRole });
User.belongsToMany(Role, { through: UserRole });

export {
    Role,
    User,
    Event,
    Task,
};