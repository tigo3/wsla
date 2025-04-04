
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/types';

interface LinkClicksTableProps {
  links: Link[];
}

const LinkClicksTable: React.FC<LinkClicksTableProps> = ({ links }) => {
  // Sort links by number of clicks (descending)
  const sortedLinks = [...links].sort((a, b) => b.clicks - a.clicks);

  // Function to truncate URLs
  const truncateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname.length > 1 ? urlObj.pathname.substring(0, 15) + '...' : ''}`;
    } catch {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Link Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLinks.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium">{link.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {truncateUrl(link.url)}
                  </a>
                </TableCell>
                <TableCell className="text-right">{link.clicks}</TableCell>
              </TableRow>
            ))}
            {sortedLinks.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                  No links found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LinkClicksTable;
