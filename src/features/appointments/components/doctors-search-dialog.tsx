// src/features/appointments/components/doctors-search-dialog.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Mail, Phone, Stethoscope, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  Id: string;
  FirstName: string;
  LastName: string;
  Gender: string;
  Specialization: string;
  Age: number;
  PrimaryEmail: string;
  PrimaryPhone: string;
  Emails: Array<{
    id: string;
    emailAddress: string;
    label: string;
    isPrimary: boolean;
  }>;
  Phones: Array<{
    id: string;
    phoneNumber: string;
    label: string;
    isPrimary: boolean;
  }>;
}

interface DoctorsSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DoctorsSearchDialog({
  open,
  onOpenChange,
}: DoctorsSearchDialogProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const specializations = useMemo(() => {
    const uniqueSpecs = new Set(doctors.map(doc => doc.Specialization));
    return Array.from(uniqueSpecs);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    let filtered = [...doctors];

    if (searchTerm) {
      filtered = filtered.filter(
        doctor =>
          `${doctor.FirstName} ${doctor.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.Specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specializationFilter !== "all") {
      filtered = filtered.filter(doctor => doctor.Specialization === specializationFilter);
    }

    return filtered;
  }, [doctors, searchTerm, specializationFilter]);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doctors?page=1&pageSize=50`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      console.log(response)
      const data = await response.json();
      console.log("repsone=========>",data);
      setDoctors(data.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctors list",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleContactEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const getPrimaryEmail = (doctor: Doctor) => {
    const primaryEmail = doctor.Emails?.find(email => email.isPrimary);
    return primaryEmail?.emailAddress || doctor.PrimaryEmail;
  };

  const getPrimaryPhone = (doctor: Doctor) => {
    const primaryPhone = doctor.Phones?.find(phone => phone.isPrimary);
    return primaryPhone?.phoneNumber || doctor.PrimaryPhone;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} onOpen={() => loadDoctors()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Doctors
          </DialogTitle>
          <DialogDescription>
            Search for doctors by name or specialization and contact them directly
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctors List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="mx-auto h-12 w-12 mb-4" />
              <p>No doctors found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDoctors.map((doctor) => {
                const primaryEmail = getPrimaryEmail(doctor);
                const primaryPhone = getPrimaryPhone(doctor);
                
                return (
                  <div key={doctor.Id} className="border rounded-lg p-4 space-y-3">
                    {/* Doctor Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {doctor.FirstName} {doctor.LastName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="secondary" className="text-sm">
                              {doctor.Specialization}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Gender: {doctor.Gender}</p>
                        <p>Age: {doctor.Age} years</p>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      {primaryPhone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleContactWhatsApp(primaryPhone)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                      {primaryEmail && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleContactEmail(primaryEmail)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}