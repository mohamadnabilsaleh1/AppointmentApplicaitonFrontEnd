// src/features/phones/components/phone-card.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone } from "../types/phone";
import {
  Phone as PhoneIcon,
  MoreVertical,
  Edit,
  Trash2,
  Star,
} from "lucide-react";
import { getPhoneLabel } from "../constants/phone-constants";

interface PhoneCardProps {
  phone: Phone;
  onEdit: (phone: Phone) => void;
  onDelete: (phone: Phone) => void;
}

export function PhoneCard({
  phone,
  onEdit,
  onDelete,
}: PhoneCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <PhoneIcon className="h-5 w-5" />
              {phone.phoneNumber}
            </CardTitle>
            <CardDescription className="capitalize">
              {getPhoneLabel(phone.label)}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {phone.isPrimary && (
              <Badge variant="default" className="text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Primary
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(phone)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(phone)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Type</span>
          <Badge variant="outline" className="text-xs capitalize">
            {getPhoneLabel(phone.label)}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            ID: {phone.id.slice(0, 8)}...
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}