"use client";

import React, { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  RefreshCw,
  Eye,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { Appointment, AppointmentsQueryParams } from "@/features/appointments/types/appointment";
import {
  useAppointments,
  useConfirmAppointment,
  useCancelAppointment,
  useCompleteAppointment,
} from "@/features/appointments/hooks/useAppointments";
import { AppointmentDetailsDialog } from "@/features/appointments/components/appointment-details-dialog";
import { DoctorAppointmentCard } from "@/features/appointments/components/doctor-appointment-card";
import { useAuth } from "@/features/authentication/hooks/useAuth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortField = "scheduledDate" | "scheduledTime" | "status" | "patient";
type SortDirection = "asc" | "desc";

export default function AppointmentsManagementPage() {
  const { toast } = useToast();
  const { token } = useAuth();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  // Default to today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [startDate, setStartDate] = useState<Date | undefined>(today);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortField, setSortField] = useState<SortField>("scheduledDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);

  // Query params for API
  const queryParams = useMemo(() => {
    const params: AppointmentsQueryParams = {
      page: currentPage,
      pageSize: pageSize,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (startDate) {
      params.startdate = format(startDate, "yyyy-MM-dd");
    }

    if (endDate) {
      params.enddate = format(endDate, "yyyy-MM-dd");
    }

    // Add sort parameter
    if (sortField === "scheduledDate") {
      params.sort = "ScheduledDate";
    } else if (sortField === "scheduledTime") {
      params.sort = "ScheduledTime";
    }

    return params;
  }, [statusFilter, startDate, endDate, currentPage, pageSize, sortField]);

  // Fetch appointments
  const {
    data: appointmentsResponse,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAppointments(queryParams, token || "");

  // Mutations
  const confirmMutation = useConfirmAppointment(token || "");
  const cancelMutation = useCancelAppointment(token || "");
  const completeMutation = useCompleteAppointment(token || "");

  // Extract appointments array from response
  const appointments = useMemo(() => {
    return appointmentsResponse?.data || [];
  }, [appointmentsResponse?.data]);

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    // Ensure appointments is always an array
    if (!Array.isArray(appointments)) {
      return [];
    }

    let filtered = [...appointments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patient.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          apt.patient.nationalID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.doctor.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          apt.facility.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "scheduledDate":
          aValue = new Date(a.scheduledDate).getTime();
          bValue = new Date(b.scheduledDate).getTime();
          break;
        case "scheduledTime":
          aValue = a.scheduledTime;
          bValue = b.scheduledTime;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "patient":
          aValue = a.patient.fullName;
          bValue = b.patient.fullName;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [appointments, searchTerm, sortField, sortDirection]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAppointments.length;
    const pending = filteredAppointments.filter(
      (apt) => apt.status === "Pending"
    ).length;
    const confirmed = filteredAppointments.filter(
      (apt) => apt.status === "Confirmed"
    ).length;
    const completed = filteredAppointments.filter(
      (apt) => apt.status === "Completed"
    ).length;
    const cancelled = filteredAppointments.filter(
      (apt) => apt.status === "Cancelled"
    ).length;

    return { total, pending, confirmed, completed, cancelled };
  }, [filteredAppointments]);

  // Handlers
  const handleConfirm = async (appointment: Appointment) => {
    try {
      await confirmMutation.mutateAsync(appointment.id);
      toast({
        title: "Appointment Confirmed",
        description: `Appointment with ${appointment.patient.fullName} has been confirmed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to confirm appointment",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (appointment: Appointment, reason: string) => {
    try {
      await cancelMutation.mutateAsync({
        appointmentId: appointment.id,
        data: { cancellationreason: reason },
      });
      toast({
        title: "Appointment Cancelled",
        description: `Appointment with ${appointment.patient.fullName} has been cancelled.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (
    appointment: Appointment,
    data: {
      diagnosis: string;
      treatmentNotes?: string;
      followUpInstructions?: string;
      medicationList?: string;
      dosageInstructions?: string;
    }
  ) => {
    try {
      await completeMutation.mutateAsync({
        appointmentId: appointment.id,
        data: {
          diagnosis: data.diagnosis,
          treatmentNotes: data.treatmentNotes,
          followUpInstructions: data.followUpInstructions,
          medicationList: data.medicationList,
          dosageInstructions: data.dosageInstructions,
        },
      });
      toast({
        title: "Appointment Completed",
        description: `Appointment with ${appointment.patient.fullName} has been completed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to complete appointment",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowDetailsDialog(true);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatTime = (time: string) => {
    const timeParts = time.split(":");
    const hours = timeParts[0].padStart(2, "0");
    const minutes = timeParts[1] || "00";
    return `${hours}:${minutes}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Confirmed":
        return "secondary";
      case "Pending":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "Confirmed":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "Pending":
        return <Clock className="h-3 w-3 mr-1" />;
      case "Cancelled":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-semibold">
            Error Loading Appointments
          </h3>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Appointments Management
          </h1>
          <p className="text-muted-foreground">
            Manage and view all your appointments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw
              className={cn(
                "mr-2 h-4 w-4",
                isRefetching && "animate-spin"
              )}
            />
            Refresh
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            onClick={() => setViewMode("table")}
            size="sm"
          >
            Table
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            onClick={() => setViewMode("cards")}
            size="sm"
          >
            Cards
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-card border rounded-lg">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-card border rounded-lg">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
        </div>
        <div className="p-4 bg-card border rounded-lg">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.confirmed}
          </p>
        </div>
        <div className="p-4 bg-card border rounded-lg">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.completed}
          </p>
        </div>
        <div className="p-4 bg-card border rounded-lg">
          <p className="text-sm text-muted-foreground">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by patient name, ID, doctor, or facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as typeof statusFilter)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setShowStartDatePicker(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover open={showEndDatePicker} onOpenChange={setShowEndDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End date (optional)"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setShowEndDatePicker(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {(statusFilter !== "all" || endDate || startDate || searchTerm) && (
            <Button variant="outline" onClick={clearFilters} className="shrink-0">
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
          <h3 className="mt-4 text-lg font-semibold">Loading appointments...</h3>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No appointments found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || startDate || endDate
              ? "Try adjusting your search or filters"
              : "No appointments scheduled"}
          </p>
          {(searchTerm || statusFilter !== "all" || startDate || endDate) && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </div>
      ) : viewMode === "table" ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleSort("scheduledDate")}
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleSort("scheduledTime")}
                  >
                    Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleSort("patient")}
                  >
                    Patient
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {new Date(appointment.scheduledDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatTime(appointment.scheduledTime)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{appointment.patient.fullName}</p>
                      {appointment.patient.nationalID && (
                        <p className="text-xs text-muted-foreground">
                          ID: {appointment.patient.nationalID}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{appointment.doctor.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.doctor.specialization}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{appointment.facility.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(appointment.status)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getStatusIcon(appointment.status)}
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{appointment.durationMinutes} min</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(appointment.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {appointment.status === "Pending" && (
                          <DropdownMenuItem
                            onClick={() => handleConfirm(appointment)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map((appointment) => (
            <DoctorAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        appointmentId={selectedAppointmentId}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
}

