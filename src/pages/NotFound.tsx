import * as React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';

const NotFound = (): JSX.Element => {
  React.useEffect(() => {
    document.title = '404 - Page Not Found';
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404 | Page not found</h1>
          <p className="text-muted-foreground">Could not find the requested resource</p>
          <Button asChild variant="link">
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
