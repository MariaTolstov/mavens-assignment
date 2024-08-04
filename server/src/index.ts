import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { Gender, IExtraUserData, IGenderResponseData, IUser } from './types';
import cors from 'cors';
import { sortBy } from 'lodash';

const PORT = 3001;

const app: Express = express();

// In-memory data store for users
// In a real-world scenario, this would be replaced with a database
const users: IUser[] = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('backend/public'));

app.post('/users/login', async (req: Request, res: Response) => {
  const { name } = req.body;

  const existingUser = users.find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );
  if (existingUser) {
    res.send({ data: { name: existingUser.name, score: existingUser.score } });
    return;
  }

  let gender: Gender | undefined;
  let extraUserData: IExtraUserData | undefined;

  try {
    const genderResponse = await axios.get(
      `https://api.genderize.io?name=${name}`
    );
    const genderData: IGenderResponseData = genderResponse.data;
    if (genderData.probability > 0.95) {
      gender = genderData.gender;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching gender: ${error.message}`);
    }
  }

  try {
    const response = await axios.get(
      `https://randomuser.me/api/?inc=email,dob,phone,cell,picture,nat${
        gender ? '&gender=' + gender : ''
      }`,
      {
        params: { dataType: 'json' },
      }
    );
    extraUserData = response.data.results[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching extra user data: ${error.message}`);
    }
  }

  const newUser = {
    name: name.toLowerCase(),
    score: 0,
    ...(extraUserData && { metadata: extraUserData }),
    ...(gender && { gender }),
  };
  users.push(newUser);

  res.send({ data: { name: newUser.name, score: newUser.score } });
});

app.put('/users/score', (req: Request, res: Response) => {
  const { name, score } = req.body;

  const userIndex = users.findIndex((user) => user.name === name.toLowerCase());
  if (userIndex > -1) {
    users[userIndex] = { ...users[userIndex], score: score };
    res.send({
      user: { name: users[userIndex].name, score: users[userIndex].score },
    });
    return;
  }

  res.status(404).send({ error: 'User not found' });
});

app.get('/users/scores', (req: Request, res: Response) => {
  res.send({ users: sortBy(users, 'score').reverse() });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
