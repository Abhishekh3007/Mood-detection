// Load environment variables early
import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
