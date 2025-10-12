import { useState } from "react";
import {
  FaPlus,
  FaUserCheck,
  FaSave,
  FaClock,
  FaSpinner,
  FaEllipsisV,
} from "react-icons/fa";

export default function TaskAssignment() {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    eventType: "",
    dueDate: "",
    priority: "low",
  });

  const staffMembers = [
    {
      id: 1,
      name: "Laurence Silvestre Benito",
      role: "Head/Owner",
      avatar: "LB",
      category: "Management",
    },
    {
      id: 2,
      name: "Hurry Silvestre",
      role: "Operation Manager",
      avatar: "HS",
      category: "Management",
    },
    {
      id: 3,
      name: "John Patrick Garcia",
      role: "Head Styling",
      avatar: "JG",
      category: "Styling",
    },
    {
      id: 4,
      name: "Carmie Maniego",
      role: "Head Styling",
      avatar: "CM",
      category: "Styling",
    },
    {
      id: 5,
      name: "Rhod Sumali",
      role: "Head Styling",
      avatar: "RS",
      category: "Styling",
    },
    {
      id: 6,
      name: "Nelson Mamangun",
      role: "Head Waiter",
      avatar: "NM",
      category: "Service",
    },
    {
      id: 7,
      name: "Patrick Garcia",
      role: "Head Waiter",
      avatar: "PG",
      category: "Service",
    },
    {
      id: 8,
      name: "Lui Tomas",
      role: "Staff (Waiter/Styling)",
      avatar: "LT",
      category: "Service",
    },
    {
      id: 9,
      name: "Paulo Lopez",
      role: "Truck Driver",
      avatar: "PL",
      category: "Logistics",
    },
    {
      id: 10,
      name: "Charlone Tolentino Mendoza",
      role: "Head/Owner",
      avatar: "CT",
      category: "Photo Connection",
    },
    {
      id: 11,
      name: "Ryan Sta. Maria",
      role: "Videographer & Photographer",
      avatar: "RS",
      category: "Photo Connection",
    },
    {
      id: 12,
      name: "Jonathan Hernandez",
      role: "Head/Owner",
      avatar: "JH",
      category: "Lights and Sounds",
    },
    {
      id: 13,
      name: "Justine Balagtas",
      role: "Hair and Make Up",
      avatar: "JB",
      category: "Hair and Make Up",
    },
  ];

  const handleStaffSelect = (member) => {
    setSelectedStaff(member);
  };

  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleSaveTask = () => {
    if (!taskForm.title) {
      alert("Please enter a task title");
      return;
    }
    alert(`Task "${taskForm.title}" has been created!`);
    setTaskForm({
      title: "",
      description: "",
      eventType: "",
      dueDate: "",
      priority: "low",
    });
  };

  const handleCancelTask = () => {
    setTaskForm({
      title: "",
      description: "",
      eventType: "",
      dueDate: "",
      priority: "low",
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto p-5 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 p-5 bg-white rounded-xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-700 to-yellow-300 text-white text-xl">
            <FaPlus />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Task Assignment
            </h1>
            <p className="text-sm text-gray-500">
              Silvestre's Events and Exquisite Style
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-400 text-white font-bold">
            LB
          </div>
          <div>
            <div className="font-semibold">Laurence Benito</div>
            <div className="text-sm text-gray-500">Event Manager</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Tasks Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Event Tasks</h2>
            <button className="flex items-center gap-2 bg-gradient-to-br from-yellow-700 to-yellow-300 text-white px-4 py-2 rounded-md hover:shadow-md">
              <FaPlus /> New Task
            </button>
          </div>

          <div className="grid gap-5">
            {/* Example Task Card */}
            <div className="border p-4 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between mb-3">
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600">
                  HIGH PRIORITY
                </div>
                <div className="cursor-pointer text-gray-400">
                  <FaEllipsisV />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Johnson Wedding - Venue Setup
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Setup tables, chairs, and decorations for wedding reception
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <div className="text-gray-400">Assigned To</div>
                  <div className="font-medium text-gray-800">
                    Nelson Mamangun
                  </div>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600">
                    Service
                  </span>
                </div>
                <div>
                  <div className="text-gray-400">Due Date</div>
                  <div className="font-medium text-gray-800">Dec 15, 2024</div>
                </div>
                <div>
                  <div className="text-gray-400">Event Type</div>
                  <div className="font-medium text-gray-800">Wedding</div>
                </div>
                <div>
                  <div className="text-gray-400">Location</div>
                  <div className="font-medium text-gray-800">Garden Venue</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold text-gray-800">65%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-blue-500"></div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                  <FaSpinner className="animate-spin" /> IN PROGRESS
                </div>
                <div className="text-gray-400">#001</div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff & Assignment */}
        <div className="space-y-6">
          {/* Staff Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Team Members
              </h2>
              <button
                className="flex items-center gap-2 border border-yellow-700 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-100"
                onClick={() =>
                  selectedStaff
                    ? alert(`Task assigned to ${selectedStaff.name}`)
                    : alert("Select a staff member first")
                }
              >
                <FaUserCheck />{" "}
                {selectedStaff
                  ? `Assign to ${selectedStaff.name.split(" ")[0]}`
                  : "Assign"}
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-4">
              {staffMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleStaffSelect(member)}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition ${
                    selectedStaff?.id === member.id
                      ? "bg-blue-100 border border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-700 to-yellow-300 text-white font-semibold">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment Form */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Assign New Task
            </h3>
            <input
              type="text"
              placeholder="Task Title"
              name="title"
              value={taskForm.title}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded-md"
            />
            <textarea
              rows="3"
              placeholder="Description"
              name="description"
              value={taskForm.description}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded-md"
            />
            <select
              name="eventType"
              value={taskForm.eventType}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Event Type</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Birthday">Birthday</option>
              <option value="Concert">Concert</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={taskForm.dueDate}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded-md"
            />
            <select
              name="priority"
              value={taskForm.priority}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={handleSaveTask}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-700 text-white px-4 py-2 rounded-md hover:shadow-md"
              >
                <FaSave /> Save Task
              </button>
              <button
                onClick={handleCancelTask}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
