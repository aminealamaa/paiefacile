'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface MobileTableProps {
  title: string;
  data: Array<Record<string, unknown>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }>;
  actions?: (row: Record<string, unknown>) => React.ReactNode;
  itemsPerPage?: number;
}

export function MobileTable({ 
  title, 
  data, 
  columns, 
  actions, 
  itemsPerPage = 5 
}: MobileTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm text-gray-500">
          {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="space-y-3">
        {currentData.map((row, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600 min-w-0 flex-1">
                    {column.label}:
                  </span>
                  <span className="text-sm text-gray-900 text-right ml-2 flex-1">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                  </span>
                </div>
              ))}
              {actions && (
                <div className="pt-3 border-t border-gray-200">
                  {actions(row)}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Desktop Table Component
interface DesktopTableProps {
  data: Array<Record<string, unknown>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }>;
  actions?: (row: Record<string, unknown>) => React.ReactNode;
}

export function DesktopTable({ data, columns, actions }: DesktopTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Responsive Table Component
interface ResponsiveTableProps {
  title: string;
  data: Array<Record<string, unknown>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }>;
  actions?: (row: Record<string, unknown>) => React.ReactNode;
  itemsPerPage?: number;
}

export function ResponsiveTable(props: ResponsiveTableProps) {
  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileTable {...props} />
      </div>
      
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{props.title}</h3>
          <DesktopTable 
            data={props.data} 
            columns={props.columns} 
            actions={props.actions} 
          />
        </div>
      </div>
    </div>
  );
}
