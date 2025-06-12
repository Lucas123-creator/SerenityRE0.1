import React, { useEffect } from 'react';
import { useLeads } from '../../../hooks/useLeads';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Button } from '../button';
import { Badge } from '../badge';
import { Skeleton } from '../skeleton';

export const LeadsList: React.FC = () => {
  const { leads, loading, error, fetchLeads, scoreLead } = useLeads();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-red-500">Error: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          ) : (
            // Lead list
            leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{lead.name}</h3>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <div className="flex space-x-2">
                    <Badge variant={lead.status === 'active' ? 'default' : 'secondary'}>
                      {lead.status}
                    </Badge>
                    <Badge variant="outline">Score: {lead.score}</Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => scoreLead(lead.id)}
                  disabled={loading}
                >
                  Re-score
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 