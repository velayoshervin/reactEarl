import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [filters, setFilters] = useState({
    start: "",
    end: "",
    status: "",
    venue: "",
    reportType: "bookings",
  });
  const [data, setData] = useState({
    bookings: [],
    revenueByMonth: [],
    loading: false,
    error: null,
  });
  const [sortMode, setSortMode] = useState("date_desc");

  const venueOptions = [
    "Baliuag Hall",
    "Bulacan Pavilion",
    "City Garden",
    "Heritage Resort",
    "Skyline Events Place",
    "Grand Ballroom",
    "Sunset Pavilion",
    "Greenfield Gardens",
    "Metro Convention Center",
    "Riverside Hall",
  ];

  const fetchData = async (endpoint) => {
    const params = new URLSearchParams();
    params.append("action", endpoint);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    try {
      const response = await fetch(`/api/reports/data?${params}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const loadReports = async () => {
    setData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [bookingsData, revenueData] = await Promise.all([
        fetchData("bookings_table"),
        fetchData("revenue_by_month"),
      ]);

      setData({
        bookings: bookingsData,
        revenueByMonth: revenueData,
        loading: false,
        error: null,
      });
    } catch (error) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load data",
      }));
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    loadReports();
  };

  const calculateKPIs = () => {
    const { bookings, revenueByMonth } = data;

    const totalRevenue = revenueByMonth.reduce(
      (sum, item) => sum + (item.revenue || 0),
      0
    );

    const outstanding = bookings.reduce(
      (sum, booking) => sum + (booking.balance || 0),
      0
    );

    const uniqueUsers = new Set(bookings.map((b) => b.customer)).size;

    return {
      totalBookings: bookings.length,
      totalRevenue,
      outstandingBalance: outstanding,
      activeUsers: uniqueUsers,
    };
  };

  const renderTable = () => {
    const { bookings } = data;
    let sortedData = [...bookings];

    // Apply sorting
    switch (sortMode) {
      case "total_asc":
        sortedData.sort((a, b) => (a.totalAmount || 0) - (b.totalAmount || 0));
        break;
      case "total_desc":
        sortedData.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
        break;
      case "date_asc":
        sortedData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "date_desc":
        sortedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }

    if (filters.reportType === "bookings") {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Balance</th>
              <th>Created</th>
              <th>Venue</th>
              <th>Package</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customer}</td>
                <td>{booking.bookingStatus}</td>
                <td>₱{(booking.totalAmount || 0).toLocaleString()}</td>
                <td>₱{(booking.balance || 0).toLocaleString()}</td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td>{booking.venue}</td>
                <td>{booking.package}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    return <div>Table for {filters.reportType}</div>;
  };

  const renderCharts = () => {
    const { bookings, revenueByMonth } = data;

    const statusChartData = {
      labels: [...new Set(bookings.map((b) => b.bookingStatus))],
      datasets: [
        {
          data: Object.values(
            bookings.reduce((acc, b) => {
              acc[b.bookingStatus] = (acc[b.bookingStatus] || 0) + 1;
              return acc;
            }, {})
          ),
          backgroundColor: ["#0d6efd", "#ffc107", "#dc3545", "#198754"],
        },
      ],
    };

    const revenueChartData = {
      labels: revenueByMonth.map((r) => r.month),
      datasets: [
        {
          label: "Revenue",
          data: revenueByMonth.map((r) => r.revenue),
          backgroundColor: "#0d6efd",
        },
      ],
    };

    // Fixed chart options with proper height constraints
    const chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    };

    return (
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Bookings by Status</Card.Title>
              <div style={{ height: "300px", position: "relative" }}>
                <Pie data={statusChartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Revenue by Month</Card.Title>
              <div style={{ height: "300px", position: "relative" }}>
                <Bar data={revenueChartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  const kpis = calculateKPIs();

  if (data.loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <img
              src="/logo.jpg"
              alt="Logo"
              style={{ height: "60px", marginRight: "15px" }}
            />
            <div>
              <h3 className="mb-1">A Web-Based Event Management System</h3>
              <h5 className="mb-0">Silvestre's Events and Exquisite Styles</h5>
              <small>
                Report Type:{" "}
                {filters.reportType.charAt(0).toUpperCase() +
                  filters.reportType.slice(1)}{" "}
                —{new Date().toLocaleDateString()}
              </small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-2">
            <Col md={2}>
              <Form.Label>Start date</Form.Label>
              <Form.Control
                type="date"
                value={filters.start}
                onChange={(e) => handleFilterChange("start", e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Label>End date</Form.Label>
              <Form.Control
                type="date"
                value={filters.end}
                onChange={(e) => handleFilterChange("end", e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Venue</Form.Label>
              <Form.Select
                value={filters.venue}
                onChange={(e) => handleFilterChange("venue", e.target.value)}
              >
                <option value="">All venues</option>
                {venueOptions.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Report Type</Form.Label>
              <Form.Select
                value={filters.reportType}
                onChange={(e) =>
                  handleFilterChange("reportType", e.target.value)
                }
              >
                <option value="bookings">Bookings</option>
                <option value="payments">Payments</option>
                <option value="users">Users</option>
                <option value="revenue">Revenue</option>
              </Form.Select>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button
                variant="primary"
                onClick={handleApplyFilters}
                className="w-100"
              >
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* KPIs */}
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h2>{kpis.totalBookings}</h2>
              <p className="text-muted mb-0">Total bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h2>₱{kpis.totalRevenue.toLocaleString()}</h2>
              <p className="text-muted mb-0">Revenue (paid)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h2>₱{kpis.outstandingBalance.toLocaleString()}</h2>
              <p className="text-muted mb-0">Outstanding balance</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h2>{kpis.activeUsers}</h2>
              <p className="text-muted mb-0">Active users</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      {renderCharts()}

      {/* Table */}
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title className="mb-0">Detailed Report</Card.Title>
            <div className="d-flex gap-2">
              <Form.Select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
                style={{ maxWidth: "200px" }}
              >
                <option value="date_desc">Created (newest)</option>
                <option value="date_asc">Created (oldest)</option>
                <option value="total_desc">Total amount (high→low)</option>
                <option value="total_asc">Total amount (low→high)</option>
              </Form.Select>
              <Button variant="outline-secondary">Export CSV</Button>
              <Button variant="outline-secondary">Export Excel</Button>
              <Button variant="outline-primary">Print PDF</Button>
            </div>
          </div>

          {data.error && <Alert variant="danger">{data.error}</Alert>}
          {data.bookings.length === 0 ? (
            <Alert variant="warning" className="text-center">
              No data found
            </Alert>
          ) : (
            renderTable()
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reports;
