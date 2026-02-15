import { Link } from 'react-router-dom';

import { RoutePath } from '@/helpers/constants/enums';

const NotFoundPage = (): React.JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <h1 className="text-6xl font-bold text-accent">404</h1>
      <p className="mt-4 text-xl text-text-primary">Page not found</p>
      <p className="mt-2 text-text-secondary">
        The page you are looking for does not exist.
      </p>
      <Link
        to={RoutePath.DASHBOARD}
        className="mt-6 rounded-lg bg-accent px-6 py-2 font-medium text-background transition-opacity hover:opacity-90"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
