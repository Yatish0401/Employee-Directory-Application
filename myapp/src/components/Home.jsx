  import axios from "axios";
  import React, { useCallback, useEffect, useState ,useRef } from "react";
  import * as XLSX from 'xlsx';          
  import * as mammoth from 'mammoth';
  import { useNavigate } from "react-router-dom";
  import { jsPDF } from 'jspdf';
  import autoTable from 'jspdf-autotable';

const countryCodes = [
  { code: "+1",   flag: "🇺🇸", name: "United States" },
  { code: "+1",   flag: "🇨🇦", name: "Canada" },
  { code: "+44",  flag: "🇬🇧", name: "United Kingdom" },
  { code: "+91",  flag: "🇮🇳", name: "India" },
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "+86",  flag: "🇨🇳", name: "China" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94",  flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "+62",  flag: "🇮🇩", name: "Indonesia" },
  { code: "+63",  flag: "🇵🇭", name: "Philippines" },
  { code: "+82",  flag: "🇰🇷", name: "South Korea" },
  { code: "+7",   flag: "🇷🇺", name: "Russia" },
  { code: "+55",  flag: "🇧🇷", name: "Brazil" },
  { code: "+52",  flag: "🇲🇽", name: "Mexico" },
  { code: "+27",  flag: "🇿🇦", name: "South Africa" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+20",  flag: "🇪🇬", name: "Egypt" },
  { code: "+31",  flag: "🇳🇱", name: "Netherlands" },
  { code: "+34",  flag: "🇪🇸", name: "Spain" },
  { code: "+39",  flag: "🇮🇹", name: "Italy" },
  { code: "+41",  flag: "🇨🇭", name: "Switzerland" },
  { code: "+46",  flag: "🇸🇪", name: "Sweden" },
  { code: "+90",  flag: "🇹🇷", name: "Turkey" },
  { code: "+98",  flag: "🇮🇷", name: "Iran" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+30",  flag: "🇬🇷", name: "Greece" },
  { code: "+32",  flag: "🇧🇪", name: "Belgium" },
  { code: "+43",  flag: "🇦🇹", name: "Austria" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+48",  flag: "🇵🇱", name: "Poland" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
];

  function Home() {

    const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [, setUserProfileId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [showRoleManagementDropdown, setShowRoleManagementDropdown] = useState(false);
    const [activeRolePanel, setActiveRolePanel] = useState(null);
    const [showDashboard, setShowDashboard] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showManageUsersDropdown, setShowManageUsersDropdown] = useState(false);
    const [viewMode, setViewMode] = useState(null);
    const [selectedProfileView, setSelectedProfileView] = useState(null);
    const [roles, setRoles] = useState([]);
    const [showEditRoleModal, setShowEditRoleModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [editingRole, setEditingRole] = useState(null);
    const [newRoleName, setNewRoleName] = useState("");
    const [selectedManagementPermissions, setSelectedManagementPermissions] = useState([]);
    const [showQuickAddRoleModal, setShowQuickAddRoleModal] = useState(false);
   const [quickRoleName, setQuickRoleName] = useState("");
   const [quickRolePermissions, setQuickRolePermissions] = useState([]);
   const [newProfileCountryCode, setNewProfileCountryCode] = useState({ code: "+1", flag: "🇺🇸", name: "United States" });
   
const [countrySearchTerm, setCountrySearchTerm] = useState("");
const [showCountryDropdown, setShowCountryDropdown] = useState(false);

const [warranties,    setWarranties]    = useState({});
const [warrantyModal, setWarrantyModal] = useState({ open:false, mode:'', item:null, lineNo:null });
const [warrantyForm,  setWarrantyForm]  = useState({ serialNumber:'', productName:'', purchaseDate:'', expiryDate:'' });
const [ticketModal,   setTicketModal]   = useState({ open:false, item:null, lineNo:null });
const [ticketForm,    setTicketForm]    = useState({ email:'', comment:'', image:null });


    
    // NEW: Orders dropdown states
    const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);
    const [showOrdersSubSection, setShowOrdersSubSection] = useState(false);
    const [showITAROrdersSubmenu, setShowITAROrdersSubmenu] = useState(false);
    const [showHardwareOrdersSubmenu, setShowHardwareOrdersSubmenu] = useState(false);
    const [showAVPosSubmenu, setShowAVPosSubmenu] = useState(false);
    const [showHardwareSoftwarePOsSubmenu, setShowHardwareSoftwarePOsSubmenu] = useState(false);
    const [showProductManagementDropdown, setShowProductManagementDropdown] = useState(false);
const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false);
    //const [hardwareSoftwarePodFiles, setHardwareSoftwarePodFiles] = useState([{ id: 1 }]);
  
    const [activeOrdersPage, setActiveOrdersPage] = useState(null);
    const [selectedAvPosOrder, setSelectedAvPosOrder] = useState(null);

    // ITAR Orders data and filters
    const [itarOrders, setItarOrders] = useState(() => {
  try {
    const saved = localStorage.getItem('itarOrders');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});
    const [editingItarOrderId, setEditingItarOrderId] = useState(null);
    const [itarOrderForm, setItarOrderForm] = useState({
      orderDate: '',
      estNo: '',
      productType: '',
      manufacturerName: '',
      partNumber: '',
      specialRequest: '',
      qty: '',
      serialNumber: '',
      location: '',
      itarNo: '',
      shipDate: '',
      invoiceNo: '',
      orderStatus: '',
      username: ''
    });

    

    const [products, setProducts] = useState(() => {
  try {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});

useEffect(() => {
  localStorage.setItem('products', JSON.stringify(products));
}, [products]);


const [productSearchTerm, setProductSearchTerm] = useState('');
const [productEntriesPerPage, setProductEntriesPerPage] = useState(10);
const [editingProductId, setEditingProductId] = useState(null);

const [selectedHwSwPosOrder, setSelectedHwSwPosOrder] = useState(null);


const [selectedItarOrder, setSelectedItarOrder] = useState(null);
const [selectedHardwareOrder, setSelectedHardwareOrder] = useState(null);


const [avPosSelectedFiles, setAvPosSelectedFiles] = useState([]);

const uploadAvPosFiles = async (orderId) => {
  if (avPosSelectedFiles.length === 0) return;
  for (const { file } of avPosSelectedFiles) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderId', orderId);
    try {
      await axios.post('http://localhost:8081/orders/avpos/upload-pod', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (err) {
      console.error('❌ File upload failed:', err.message);
    }
  }
  setAvPosSelectedFiles([]);
  setAvPosFileInputs([{ id: 1 }]);
};


const fetchProducts = useCallback(() => {
  axios.get('http://localhost:8081/products')
    .then((res) => {
      const data = res.data || [];   // ✅ hamesha latest data use karo
      setProducts(data);
      localStorage.setItem('products', JSON.stringify(data));
    })
    .catch((error) => {
      console.error('❌ Error fetching products:', error);
      try {
        const saved = localStorage.getItem('products');
        if (saved) setProducts(JSON.parse(saved));
      } catch { setProducts([]); }
    });
}, []);


// ← ADD THIS RIGHT HERE
const filteredProducts = products.filter(product => {
  const searchLower = productSearchTerm.toLowerCase();
  return (
    (product.product_type || '').toLowerCase().includes(searchLower) ||
    (product.part_number || '').toLowerCase().includes(searchLower) ||
    (product.manufacturer_name || '').toLowerCase().includes(searchLower) ||
    (product.product_description || '').toLowerCase().includes(searchLower)
  );
});

// prev and next for product management
 const [currentPage, setCurrentPage] = React.useState(1);
const totalPages = Math.ceil(filteredProducts.length / productEntriesPerPage) || 1;
    // Report filters
    const [reportFilters, setReportFilters] = useState({
      reportType: 'location', // 'location' or 'product'
      productType: '',
      manufacturerName: '',
      partNumber: '',
      orderStatus: '',
      location: ''
    });

    // List filters
    const [listSearchTerm, setListSearchTerm] = useState('');
    const [itarItemRows, setItarItemRows] = useState([]);

const addItarRow = () => {
  setItarItemRows(prev => [...prev, { id: Date.now(), productType: "", manufacturerName: "", partNumber: "", qty: "", serialNumber: "", specialRequest: '' }]);
};

const removeItarRow = (id) => {
  setItarItemRows(prev => prev.filter(row => row.id !== id));
};

const updateItarRow = (id, field, value) => {
  setItarItemRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
};
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [expandedAvPosOrderId, setExpandedAvPosOrderId] = useState(null);
const [expandedHwSwOrderId, setExpandedHwSwOrderId] = useState(null);



  const [hardwareOrders, setHardwareOrders] = useState(() => {
  try {
    const saved = localStorage.getItem('hardwareOrders');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});
  const [editingHardwareOrderId, setEditingHardwareOrderId] = useState(null);
  const [hardwareOrderForm, setHardwareOrderForm] = useState({
    orderDate: '',
    estNo: '',
    selectedUser: '',
    productType: '',
    manufacturerName: '',
    partNumber: '',
    qty: '',
    serialNumber: '',
    location: '',
    hardwareNo: '',
    orderStatus: '',
    shipDate: '',     
    invoiceNo: '',
    remark: ''
  });

const [itarPodFiles, setItarPodFiles] = useState([]);
  const [itarCurrentPage, setItarCurrentPage] = React.useState(1);
const [hardwareCurrentPage, setHardwareCurrentPage] = React.useState(1);
const [avPosCurrentPage, setAvPosCurrentPage] = React.useState(1);
const [hwSwPosCurrentPage, setHwSwPosCurrentPage] = React.useState(1);
const [manufacturerCurrentPage, setManufacturerCurrentPage] = React.useState(1);

const [payEmail, setPayEmail] = React.useState('');
const [sending, setSending] = React.useState(false);

  // Hardware Orders Report filters
  const [hardwareReportFilters, setHardwareReportFilters] = useState({
    reportType: 'location', // 'location' or 'product'
    productType: '',
    manufacturerName: '',
    partNumber: '',
    orderStatus: '',
    location: ''
  });

  // Hardware Orders List filters
  const [hardwareListSearchTerm, setHardwareListSearchTerm] = useState('');
  const [hardwareEntriesPerPage, setHardwareEntriesPerPage] = useState(10);

const [hardwarePodFiles, setHardwarePodFiles] = useState([]);
  const [hardwareItemRows, setHardwareItemRows] = useState([]);
const addHardwareRow = () => setHardwareItemRows(prev => [...prev, { id: Date.now(), productType: "", manufacturerName: "", partNumber: "", qty: "", serialNumber: "" }]);
const removeHardwareRow = (id) => setHardwareItemRows(prev => prev.filter(r => r.id !== id));
const updateHardwareRow = (id, field, value) => setHardwareItemRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  // AV Pos Orders data and filters
  const [avPosOrders, setAvPosOrders] = useState(() => {
  try {
    const saved = localStorage.getItem('avPosOrders');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});
  const [editingAvPosOrderId, setEditingAvPosOrderId] = useState(null);
  const [avPosOrderForm, setAvPosOrderForm] = useState({
    orderDate: '',
    estNo: '',
    productType: '',
    userId: '',
    manufacturerName: '',
    partNumber: '',
    qty: '',
    serialNumber: '',
    location: '',
    avPosNo: '',
    shipDate: '',
    invoiceNo: '',
    orderStatus: '',
    sow: ''
  });

  // File inputs for AV Pos
  const [avPosFileInputs, setAvPosFileInputs] = useState([{ id: 1 }]);

  const [avPosItemRows, setAvPosItemRows] = useState([]);
const addAvPosRow = () => setAvPosItemRows(prev => [...prev, { id: Date.now(), productType: "", manufacturerName: "", partNumber: "", qty: "", serialNumber: "" }]);
const removeAvPosRow = (id) => setAvPosItemRows(prev => prev.filter(r => r.id !== id));
const updateAvPosRow = (id, field, value) => setAvPosItemRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));


  // AV Pos Report filters
  const [avPosReportFilters, setAvPosReportFilters] = useState({
    reportType: 'location',
    productType: '',
    manufacturerName: '',
    partNumber: '',
    orderStatus: '',
    location: ''
  });

// Hardware & Software POs
  const [hardwareSoftwarePosListSearchTerm, setHardwareSoftwarePosListSearchTerm] = useState('');
  const [hardwareSoftwarePosEntriesPerPage, setHardwareSoftwarePosEntriesPerPage] = useState(10);
  const [hardwareSoftwarePosOrders, setHardwareSoftwarePosOrders] = useState(() => {
  try {
    const saved = localStorage.getItem('hardwareSoftwarePosOrders');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});
  const [editingHardwareSoftwarePosOrderId, setEditingHardwareSoftwarePosOrderId] = useState(null);
  const [hardwareSoftwarePosOrderForm, setHardwareSoftwarePosOrderForm] = useState({
    orderDate: '', estNo: '', productType: '', userId: '',
    manufacturerName: '', partNumber: '', qty: '', serialNumber: '',
    location: '', poNo: '', shipDate: '', invoiceNo: '', orderStatus: ''
  });

  // Hardware & Software POs Report filters
  const [hardwareSoftwarePosReportFilters, setHardwareSoftwarePosReportFilters] = useState({
    reportType: 'location', productType: '', manufacturerName: '',
    partNumber: '', orderStatus: '', location: ''
  });

  const [hwSwPosItemRows, setHwSwPosItemRows] = useState([]);
const addHwSwPosRow = () => setHwSwPosItemRows(prev => [...prev, { id: Date.now(), productType: "", manufacturerName: "", partNumber: "", qty: "", serialNumber: "" }]);
const removeHwSwPosRow = (id) => setHwSwPosItemRows(prev => prev.filter(r => r.id !== id));
const updateHwSwPosRow = (id, field, value) => setHwSwPosItemRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

 // Auto-save to localStorage whenever orders change
useEffect(() => {
  localStorage.setItem('itarOrders', JSON.stringify(itarOrders));
}, [itarOrders]);

useEffect(() => {
  localStorage.setItem('hardwareOrders', JSON.stringify(hardwareOrders));
}, [hardwareOrders]);

useEffect(() => {
  localStorage.setItem('avPosOrders', JSON.stringify(avPosOrders));
}, [avPosOrders]);

useEffect(() => {
  localStorage.setItem('hardwareSoftwarePosOrders', JSON.stringify(hardwareSoftwarePosOrders));
}, [hardwareSoftwarePosOrders]);


const [manufacturerForm, setManufacturerForm] = useState({ name: '', productType: '' });
const [manufacturers, setManufacturers] = useState(() => {
  try {
    const saved = localStorage.getItem('manufacturers');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});

useEffect(() => {
  localStorage.setItem('manufacturers', JSON.stringify(manufacturers));
}, [manufacturers]);

const handleSaveManufacturer = async () => {
  if (!manufacturerForm.name.trim()) {
    alert("❌ Manufacturer name is required!");
    return;
  }
  try {
    if (manufacturerForm.id) {
      await axios.put(`http://localhost:8081/manufacturers/${manufacturerForm.id}`, {
        name: manufacturerForm.name,
        productType: manufacturerForm.productType
      });
      addActivityLog("Updated", "Manufacturer", `Manufacturer updated — Name: ${manufacturerForm.name}, Type: ${manufacturerForm.productType}`);
      alert("✅ Manufacturer updated successfully!");
      setActiveOrdersPage('manufacturer-list');
    } else {
      await axios.post('http://localhost:8081/manufacturers', {
        name: manufacturerForm.name,
        productType: manufacturerForm.productType
      });
      addActivityLog("Created", "Manufacturer", `New Manufacturer added — Name: ${manufacturerForm.name}, Type: ${manufacturerForm.productType}`);
      alert("✅ Manufacturer saved successfully!");
    }
    setManufacturerForm({ name: '', productType: '' });
    fetchManufacturers();
    setActiveOrdersPage('manufacturer-list');
  } catch (error) {
    console.error('❌ Error saving manufacturer:', error);
    alert(`❌ Failed to save: ${error.response?.data?.error || error.message}`);
  }
};

const [manufacturerSearchTerm, setManufacturerSearchTerm] = useState('');
const [manufacturerEntriesPerPage, setManufacturerEntriesPerPage] = useState(10);

// Add this derived value (alongside your other filtered lists)
const filteredManufacturers = manufacturers.filter(m =>
  m.name?.toLowerCase().includes(manufacturerSearchTerm.toLowerCase()) ||
  m.productType?.toLowerCase().includes(manufacturerSearchTerm.toLowerCase())
);


// ── ITAR POD File Inputs ──
const [itarFileInputs, setItarFileInputs] = useState([{ id: Date.now() }]);
const [itarSelectedFiles, setItarSelectedFiles] = useState([]);

// ── Hardware POD File Inputs ──
const [hardwareFileInputs, setHardwareFileInputs] = useState([{ id: Date.now() }]);
const [hardwareSelectedFiles, setHardwareSelectedFiles] = useState([]);


// Add a new file input row
const handleAddItarFile = () => {
  setItarFileInputs(prev => [...prev, { id: Date.now() }]);
};

// Remove a file input row by id
const handleRemoveItarFile = (id) => {
  setItarFileInputs(prev => prev.filter(f => f.id !== id));
};

// Upload all selected files (call this inside handleSaveItarOrder)
const uploadItarPodFiles = async (orderId) => {
  for (const { file } of itarSelectedFiles) {
    if (!file) continue;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(
      `http://localhost:8081/orders/itar/${orderId}/pod-files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
  setItarSelectedFiles([]);
  setItarFileInputs([{ id: Date.now() }]);
};


const handleAddHardwareFile = () => {
  setHardwareFileInputs(prev => [...prev, { id: Date.now() }]);
};

const handleRemoveHardwareFile = (id) => {
  setHardwareFileInputs(prev => prev.filter(f => f.id !== id));
};

const uploadHardwarePodFiles = async (orderId) => {
  for (const { file } of hardwareSelectedFiles) {
    if (!file) continue;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(
      `http://localhost:8081/orders/hardware/${orderId}/pod-files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
  setHardwareSelectedFiles([]);
  setHardwareFileInputs([{ id: Date.now() }]);
};



const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

const [activityLogs, setActivityLogs] = useState(() => {
  try {
    const saved = localStorage.getItem('activityLogs');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    const filtered = parsed.filter(log =>
      new Date().getTime() - new Date(log.timestamp).getTime() < SIXTY_DAYS_MS
    );
    localStorage.setItem('activityLogs', JSON.stringify(filtered));
    // ✅ Sirf ye line change karo
    return [...filtered].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch { return []; }
});
const [avPosFileRefreshKey, setAvPosFileRefreshKey] = useState(0);
const [activityLogSearch, setActivityLogSearch] = useState('');

useEffect(() => {
  localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
}, [activityLogs]);


  const addActivityLog = async (action, module, details) => {
    let currentUser = user;
    if (!currentUser) {
      try {
        const stored = localStorage.getItem("user");
        if (stored) currentUser = JSON.parse(stored);
      } catch {}
    }

    const newLog = {
      id: Date.now(),
      action,
      module,
      details,
      performedBy: currentUser?.name || currentUser?.username || "Unknown User",
      timestamp: new Date().toISOString(),
    };

    // localStorage mein bhi rakho (instant UI update ke liye)
   setActivityLogs (prev => [newLog, ...prev]);

    // DB mein bhi save karo
    try {
      await axios.post('http://localhost:8081/activity', {
        userId: currentUser?.id || null,
        userName: currentUser?.name || currentUser?.username || "Unknown",
        action,
        module,
        details,
      });
    } catch (err) {
      console.error('❌ Activity log DB save failed:', err.message);
    }
  };

useEffect(() => {
  if (activeOrdersPage === 'activity-logs' && user?.id) {

    // DB se 60 din purane logs delete karo
    axios.delete('http://localhost:8081/activity/cleanup').catch(() => {});

    axios.get(`http://localhost:8081/activity?userId=${user.id}`)
      .then((res) => {
        const dbLogs = (res.data || []).map(log => ({
  id: log.id,
  action: log.action,
  module: log.module,
  details: log.details,
  performedBy: log.user_name || "Unknown",
  timestamp: log.created_at,
}));
setActivityLogs(dbLogs);
localStorage.setItem('activityLogs', JSON.stringify(dbLogs));
      })
      .catch((err) => console.error('❌ Activity fetch error:', err));
  }
}, [activeOrdersPage, user]);


    const [newProfile, setNewProfile] = useState({
      name: "",
      username: "", 
      email: "",
      phone: "",
      password: "",
      role: "",
      permissions: []
    });

    const navigate = useNavigate();
    const userPermissions = user?.permissions || [];

const hasPermission = (permission) => {
  if (user?.role?.toUpperCase() === 'SUPERADMIN') return true;
  if (!userPermissions || userPermissions.length === 0) return false;
  
  // Direct permission check
  if (userPermissions.includes(permission)) return true;
  
  // Parent permission se bhi check karo
  // Agar ITAR-Order hai to ITAR-Order-View bhi maano
  const parentMap = {
    'ITAR-Order-Add':    'ITAR-Order',
    'ITAR-Order-Edit':   'ITAR-Order',
    'ITAR-Order-Delete': 'ITAR-Order',
    'ITAR-Order-View':   'ITAR-Order',
    'AV-Pos-Add':    'AV-Pos',
    'AV-Pos-Edit':   'AV-Pos',
    'AV-Pos-Delete': 'AV-Pos',
    'AV-Pos-View':   'AV-Pos',
    'Hardware-orders-Add':    'Hardware-orders',
    'Hardware-orders-Edit':   'Hardware-orders',
    'Hardware-orders-Delete': 'Hardware-orders',
    'Hardware-orders-View':   'Hardware-orders',
    'Hardware-software-pos-Add':    'Hardware-software-pos',
    'Hardware-software-pos-Edit':   'Hardware-software-pos',
    'Hardware-software-pos-Delete': 'Hardware-software-pos',
    'Hardware-software-pos-View':   'Hardware-software-pos',
  };
  
  const parent = parentMap[permission];
  if (parent && userPermissions.includes(parent)) return true;
  
  return false;
};

const hasAnyPermission = (permissions) => {
  if (user?.role?.toUpperCase() === 'SUPERADMIN') return true;
  return permissions.some(p => hasPermission(p));
};


    const [hwSwPodFileInputs, setHwSwPodFileInputs] = useState([{ id: 1, file: null }]);
    const hwSwPodFilesRef = useRef([]);


    const countByRole = (roleName) => {
      if (!data || data.length === 0) return 0;
      
      const count = data.filter(profile => {
        if (!profile.role) return false;
        return profile.role.toLowerCase() === roleName.toLowerCase();
      }).length;
      
      console.log(`📊 Count for role "${roleName}":`, count);
      return count;
    };

    const managementPermissions = [
      "role-list",
      "role-create",
      "role-edit",
      "role-delete",
      "user-list",
      "user-create",
      "user-edit",
      "user-delete",
      "ITAR-Order",
      "AV-Pos",
      "product-list",        
      "product-create",      
      "product-edit",       
      "product-delete",     
      "manufacturer-list",   
      "manufacturer-create", 
      "manufacturer-edit",   
      "manufacturer-delete", 
      "Hardware-software-pos",
      "Hardware-orders",
      "ITAR-Order-Add",
      "ITAR-Order-Edit",
      "ITAR-Order-Delete",
      "ITAR-Order-View",
      "AV-Pos-Add",
      "AV-Pos-Edit",
      "AV-Pos-Delete",
      "AV-Pos-View",
      "Hardware-software-pos-Add",
      "Hardware-software-pos-Edit",
      "Hardware-software-pos-Delete",
      "Hardware-software-pos-View",
      "Hardware-orders-Add",
      "Hardware-orders-Delete",
      "Hardware-orders-View",
      "Hardware-orders-Edit"
    ];

    const ITAR_PART_NUMBERS = {
  hardware: [
    "32UN650-W - 32\" 4K",
    "LG 27 inch - 4K - monitor",
    "Pickering AV Boardroom",
    "Qoute 1755",
    "gaming laptop",
    "86\" screens and brightsign players",
    "17\" laptops for parker",
    "GO Pro Camera and Battery",
    "85 TV Swivel Wall Mount",
    "55UN78003",
    "jdshfksglkdfig",
  ],
  software: [
    "001",
    "002",
    "Uttv",
  ],
  services: [
    "install",
  ]
};
const getItarPartByType = (productType, manufacturerName) => {
  if (!productType) return [];

  // Manufacturer bhi select hai to DB se filter karo
  if (manufacturerName) {
    return products
      .filter(p =>
        p.product_type?.toLowerCase() === productType?.toLowerCase() &&
        p.manufacturer_name?.toLowerCase() === manufacturerName?.toLowerCase() &&
        p.part_number
      )
      .filter((p, index, self) =>
        index === self.findIndex(x => x.part_number === p.part_number)
      )
      .map(p => p.part_number);
  }

  // Sirf product type select hai to hardcoded list do
  return ITAR_PART_NUMBERS[productType?.toLowerCase()] || [];
};

   const permissionChildren = {
  "ITAR-Order": ["ITAR-Order-Add", "ITAR-Order-Edit", "ITAR-Order-Delete", "ITAR-Order-View"],
  "AV-Pos": ["AV-Pos-Add", "AV-Pos-Edit", "AV-Pos-Delete", "AV-Pos-View"],
  "Hardware-software-pos": ["Hardware-software-pos-Add", "Hardware-software-pos-Edit", "Hardware-software-pos-Delete", "Hardware-software-pos-View"],
  "Hardware-orders": ["Hardware-orders-Add", "Hardware-orders-Edit", "Hardware-orders-Delete", "Hardware-orders-View"]
};

const toggleManagementPermission = (permission) => {
  setSelectedManagementPermissions((prev) => {
    const children = permissionChildren[permission] || [];
    if (prev.includes(permission)) {
      // Uncheck karo - parent aur sab children remove karo
      return prev.filter((p) => p !== permission && !children.includes(p));
    } else {
      // Check karo - parent aur sab children add karo
      const toAdd = [permission, ...children].filter(p => !prev.includes(p));
      return [...prev, ...toAdd];
    }
  });
};
// for contry code dropdown and serachable
    useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest('.country-dropdown-wrapper')) {
      setShowCountryDropdown(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

    const fetchRoles = useCallback(() => {
      axios.get('http://localhost:8081/roles')
        .then((res) => {
          console.log('✅ Fetched roles:', res.data);
          setRoles(res.data);
        })
        .catch((error) => {
          console.error('❌ Error fetching roles:', error);
        });
    }, []);

    const saveRole = async () => {
      try {
        if (!newRoleName.trim()) {
          alert("❌ Role name is required!");
          return;
        }

        await axios.post("http://localhost:8081/roles", {
          role_name: newRoleName,
          permissions: selectedManagementPermissions,
          created_by: user?.id || null
        });

        alert("✅ Role created successfully!");
        addActivityLog("Created", "Role Management", `New role created — Name: ${newRoleName}, Permissions: ${selectedManagementPermissions.length}`);
        setNewRoleName("");
        setSelectedManagementPermissions([]);
        fetchRoles();
        setActiveRolePanel("list");
      } catch (err) {
        console.error("❌ Error creating role:", err);
        alert(err.response?.data?.error || "Failed to save role");
      }
    };

    const handleEditRole = (role) => {
      setEditingRole({
        id: role.id,
        role_name: role.role_name,
        permissions: Array.isArray(role.permissions)
          ? role.permissions
          : (typeof role.permissions === 'string' ? JSON.parse(role.permissions) : [])
      });
      setShowEditRoleModal(true);
    };

    const handleUpdateRole = async () => {
      try {
        if (!editingRole.role_name.trim()) {
          alert("❌ Role name is required!");
          return;
        }

        await axios.put(`http://localhost:8081/roles/${editingRole.id}`, {
          role_name: editingRole.role_name,
          permissions: editingRole.permissions
        });

        alert("✅ Role updated successfully!");
        const oldRole = roles.find(r => r.id === editingRole.id);
const oldPerms = oldRole?.permissions || [];
const newPerms = editingRole.permissions;
const addedPerms = newPerms.filter(p => !oldPerms.includes(p));
const removedPerms = oldPerms.filter(p => !newPerms.includes(p));
const remainingPerms = newPerms.filter(p => oldPerms.includes(p));

let permDetails = `Role updated — Name: ${editingRole.role_name}`;
if (addedPerms.length > 0) permDetails += ` | ✅ Added: ${addedPerms.join(", ")}`;
if (removedPerms.length > 0) permDetails += ` | ❌ Removed: ${removedPerms.join(", ")}`;
if (remainingPerms.length > 0) permDetails += ` | 🔒 Existing: ${remainingPerms.join(", ")}`;

addActivityLog("Updated", "Role Management", permDetails);
        setShowEditRoleModal(false);
        setEditingRole(null);
        fetchRoles();
      } catch (err) {
        console.error("❌ Error updating role:", err);
        alert(err.response?.data?.error || "Failed to update role");
      }
    };

  const fetchUserProfiles = useCallback(() => {
    if (!user) {
      console.log("No user logged in, skipping profile fetch");
      setLoading(false);
      return;
    }

    setLoading(true);
    const userId = user.id;
    const userRole = user.role || "user";

    console.log("🔍 Fetching profiles for user:", userId, "role:", userRole);
    
    axios
      .get(`http://localhost:8081/users`)
      .then((res) => {
        const profiles = res.data || [];
        console.log(`✅ Fetched ${profiles.length} profiles`);
        console.log('📋 Sample profiles:', profiles.slice(0, 3));
        setData(profiles);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Error fetching profiles:', error);
        setLoading(false);
      });
  }, [user, viewMode]);

    const fetchUserProfileId = useCallback(async (userId) => {
      try {
        console.log("🔍 Fetching profile ID for user:", userId);
        const res = await axios.get(`http://localhost:8081/users/${userId}/profile`);
        setUserProfileId(res.data.profileId);
        console.log("✅ User's profile ID:", res.data.profileId);
      } catch (error) {
        console.error('❌ Error fetching user profile ID:', error);
      }
    }, []);

    const refreshUserData = useCallback(async () => {
  const loggedUser = localStorage.getItem("user");
  if (loggedUser) {
    try {
      const userData = JSON.parse(loggedUser);
      const res = await axios.get(`http://localhost:8081/users/${userData.id}/full`);
      const updatedUser = res.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log("✅ User data refreshed");
      console.log("🔍 Full user:", updatedUser);
      console.log("🔍 Permissions:", updatedUser.permissions);
      return updatedUser;
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
    }
  }
}, []);

  useEffect(() => {
  const loggedUser = localStorage.getItem("user");
  if (loggedUser) {
    const userData = JSON.parse(loggedUser);
    console.log("👤 Logged in user:", userData.name, "Role:", userData.role);
    setUser(userData);
    fetchUserProfileId(userData.id);

   
    if (userData.role?.toUpperCase() !== "SUPERADMIN") {
      setShowDashboard(false);
      
    }
  } else {
    setLoading(false);
  }
}, [fetchUserProfileId]);

    useEffect(() => {
      const handleProfileUpdate = (event) => {
        console.log("🔄 Profile updated event received");
        fetchUserProfiles();
        refreshUserData();
      };

      const handleRoleUpdate = (event) => {
        console.log("🔄 Role updated event received");
        refreshUserData();
        fetchUserProfiles();
      };

      window.addEventListener("profileUpdated", handleProfileUpdate);
      window.addEventListener("roleUpdated", handleRoleUpdate);

      return () => {
        window.removeEventListener("profileUpdated", handleProfileUpdate);
        window.removeEventListener("roleUpdated", handleRoleUpdate);
      };
    }, [fetchUserProfiles, refreshUserData]);

    useEffect(() => {
      if (user) {
        fetchUserProfiles();
      }
    }, [user, fetchUserProfiles, viewMode]);

    useEffect(() => {
      fetchRoles();
    }, [fetchRoles]);

   const fetchManufacturers = useCallback(() => {
  axios.get('http://localhost:8081/manufacturers')
    .then((res) => {
      const data = res.data || [];   // ✅ hamesha latest data use karo
      setManufacturers(data);
      localStorage.setItem('manufacturers', JSON.stringify(data));
    })
    .catch(() => {
      try {
        const saved = localStorage.getItem('manufacturers');
        if (saved) setManufacturers(JSON.parse(saved));
      } catch { setManufacturers([]); }
    });
}, []);

useEffect(() => {
  if (user) {
    fetchItarOrders();
    fetchHardwareOrders();
    fetchAvPosOrders();
    fetchHardwareSoftwarePosOrders();
    fetchProducts();
    fetchManufacturers();
  }

}, []);

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  if (activeOrdersPage !== 'hardware-orders-detail' || !selectedHardwareOrder) return;
  const order   = selectedHardwareOrder;
  const orderId = order.id || order.hardware_id;
  const BASE    = 'http://localhost:8081';

  const loadWarranties = async () => {
    const loaded = {};

    // ✅ Load main order warranty
    try {
      const res = await axios.get(`${BASE}/warranty/order-main/${orderId}`);
      if (res.data) {
        const w = res.data;
        loaded[`order-${orderId}`] = {
          serialNumber: w.serial_number || '',
          productName:  w.product_name  || '',
          purchaseDate: w.purchase_date ? w.purchase_date.substring(0, 10) : '',
          expiryDate:   w.expiry_date   ? w.expiry_date.substring(0, 10)   : '',
        };
      }
    } catch { }

    // ✅ Load inline item warranties
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      if (!item.id) continue;
      try {
        const res = await axios.get(`${BASE}/warranty/${item.id}`);
        if (res.data) {
          const w = res.data;
          loaded[String(item.id)] = {
            serialNumber: w.serial_number || '',
            productName:  w.product_name  || '',
            purchaseDate: w.purchase_date ? w.purchase_date.substring(0, 10) : '',
            expiryDate:   w.expiry_date   ? w.expiry_date.substring(0, 10)   : '',
          };
        }
      } catch { }
    }

    setWarranties(loaded); // ✅ Set everything at once
  };

  loadWarranties();
}, [activeOrdersPage, selectedHardwareOrder]);


    useEffect(() => {
  const handleResize = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    if (!mobile) setSidebarOpen(false);
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


const handleDeleteProduct = async (id) => {
  if (window.confirm("Are you sure you want to delete this product?")) {
    try {
      const product = products.find(p => p.id === id);
      await axios.delete(`http://localhost:8081/products/${id}`);
      addActivityLog("Deleted", "Product", `Product deleted — Part#: ${product?.part_number}, Type: ${product?.product_type}`);
      alert("✅ Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      alert(`❌ Failed to delete: ${error.response?.data?.error || error.message}`);
    }
  }
};

const handleSaveProduct = async () => {
  if (!productForm.productType) { alert("❌ Please select a product type!"); return; }
  if (!productForm.partNumber.trim()) { alert("❌ Part Number is required!"); return; }
  if (!productForm.manufacturerName) { alert("❌ Please select a Manufacturer!"); return; }

  let imageDataUrl = null;
  if (productForm.productImage) {
    imageDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(productForm.productImage);
    });
  }

  try {
    const payload = {
      productType: productForm.productType,
      partNumber: productForm.partNumber,
      manufacturerName: productForm.manufacturerName,
      productDescription: productForm.productDescription || '',
      extraDetails: productForm.extraDetails || '',
      productImage: imageDataUrl || null
    };

    if (editingProductId) {
      const oldProduct = products.find(p => p.id === editingProductId);
      if (!imageDataUrl) payload.productImage = oldProduct?.product_image || null;
      
      await axios.put(`http://localhost:8081/products/${editingProductId}`, payload);
      
     const productChanges = [];
if (oldProduct?.product_type !== productForm.productType) 
  productChanges.push(`Type: "${oldProduct?.product_type}" → "${productForm.productType}"`);
if (oldProduct?.part_number !== productForm.partNumber) 
  productChanges.push(`Part#: "${oldProduct?.part_number}" → "${productForm.partNumber}"`);
if (oldProduct?.manufacturer_name !== productForm.manufacturerName) 
  productChanges.push(`Manufacturer: "${oldProduct?.manufacturer_name}" → "${productForm.manufacturerName}"`);
if ((oldProduct?.product_description ?? '') !== (productForm.productDescription ?? '')) 
  productChanges.push(`Description: "${oldProduct?.product_description ?? ''}" → "${productForm.productDescription ?? ''}"`);
if ((oldProduct?.extra_details ?? '') !== (productForm.extraDetails ?? '')) 
  productChanges.push(`Extra Details: "${oldProduct?.extra_details ?? ''}" → "${productForm.extraDetails ?? ''}"`);
if (imageDataUrl) 
  productChanges.push(`Image: Updated`);

if (productChanges.length > 0) {
  addActivityLog("Updated", "Product", `Product updated — ${productChanges.join(", ")}`);
} else {
  addActivityLog("Updated", "Product", `Product opened for edit — no changes made`);
}
      alert("✅ Product updated successfully!");
      setEditingProductId(null);
      setActiveOrdersPage('product-management-list');
    } else {
      await axios.post('http://localhost:8081/products', payload);
      addActivityLog("Created", "Product", `New Product added — Part#: ${productForm.partNumber}, Type: ${productForm.productType}, Manufacturer: ${productForm.manufacturerName}`);
      alert("✅ Product saved successfully!");
    }

    setProductForm({
      productType: '', partNumber: '', manufacturerName: '',
      productDescription: '', extraDetails: '', productImage: null
    });
    fetchProducts();
    setActiveOrdersPage('product-management-list');

  } catch (error) {
    console.error('❌ Error saving product:', error);
    alert(`❌ Failed to save: ${error.response?.data?.error || error.message}`);
  }
};

    const handleDelete = (id) => {
  const profile = data.find(p => p.id === id);
  const profileName = profile?.name || "Unknown";
  const profileEmail = profile?.email || "Unknown";
  const profileRole = profile?.role || "Unknown";

  if (window.confirm(`Are you sure you want to delete profile of "${profileName}"?\n\nThis action cannot be undone!`)) {
    axios.delete(`http://localhost:8081/profiles/${id}`).then(() => {
      addActivityLog("Deleted", "User Management", `Profile deleted — Name: "${profileName}", Email: "${profileEmail}", Role: "${profileRole}"`);
      fetchUserProfiles();
      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: { deletedId: id } }));
      alert(`✅ Profile of "${profileName}" deleted successfully!`);
    }).catch((error) => {
      console.error('Error deleting profile:', error);
      alert("❌ Failed to delete profile: " + (error.response?.data?.error || error.message));
    });
  }
};

   const handleEditProfile = (profile) => {
 
  const currentRole = roles.find(r => 
    r.role_name.toUpperCase() === (profile.role || '').toUpperCase()
  );
  const currentPermissions = currentRole 
    ? currentRole.permissions  
    : (Array.isArray(profile.permissions)
        ? profile.permissions
        : (typeof profile.permissions === 'string' 
            ? JSON.parse(profile.permissions) 
            : []));

  setEditingProfile({
    id: profile.id,
    name: profile.name,
    username: profile.username || "",
    email: profile.email,
    phone: profile.phone || "",
    role: profile.role || "",
    permissions: currentPermissions 
  });
  setShowEditModal(true);
};

    const handleUpdateProfile = async () => {
      try {
        if (!editingProfile.name || !editingProfile.email || !editingProfile.phone || !editingProfile.role) {
          alert("❌ Name, Email, Phone, and Role are required!");
          return;
        }
        const selectedRole = roles.find(r => 
      r.role_name.toUpperCase() === editingProfile.role.toUpperCase()
    );
    const latestPermissions = selectedRole ? selectedRole.permissions : editingProfile.permissions;

        const payload = {
          name: editingProfile.name,
          username: editingProfile.username || null, 
          email: editingProfile.email,
          phone: editingProfile.phone,
          role: editingProfile.role.toUpperCase(),
          permissions: latestPermissions
        };

        console.log("📝 Updating profile with payload:", payload);

        const oldProfile = data.find(p => p.id === editingProfile.id);
      await axios.put(`http://localhost:8081/profiles/${editingProfile.id}`, payload);

        console.log("✅ Profile updated successfully");

        const updatedProfileUserId = data.find(p => p.id === editingProfile.id)?.user_id;
        if (updatedProfileUserId === user?.id) {
          console.log("🔄 Updated profile belongs to logged-in user, refreshing account info...");
          await refreshUserData();
        }

        setShowEditModal(false);
        setEditingProfile(null);
        fetchUserProfiles();

        window.dispatchEvent(new CustomEvent("profileUpdated", {
          detail: { profileId: editingProfile.id, updatedData: payload }
        }));

        alert("✅ Profile updated successfully!");
       
const userChanges = [];
if (oldProfile?.name !== editingProfile.name) userChanges.push(`Name: "${oldProfile?.name}" → "${editingProfile.name}"`);
if (oldProfile?.email !== editingProfile.email) userChanges.push(`Email: "${oldProfile?.email}" → "${editingProfile.email}"`);
if (oldProfile?.username !== editingProfile.username) userChanges.push(`Username: "${oldProfile?.username}" → "${editingProfile.username}"`);
if (oldProfile?.phone !== editingProfile.phone) userChanges.push(`Phone: "${oldProfile?.phone}" → "${editingProfile.phone}"`);
if ((oldProfile?.role || '').toUpperCase() !== (editingProfile.role || '').toUpperCase()) userChanges.push(`Role: "${oldProfile?.role}" → "${editingProfile.role}"`);
addActivityLog("Updated", "User Management", `Profile updated — ${userChanges.length > 0 ? userChanges.join(", ") : "No changes detected"}`);
      } catch (error) {
        console.error('❌ Error updating profile:', error);
        console.error('Error response:', error.response?.data);
        alert(`❌ Failed to update profile: ${error.response?.data?.error || error.message}`);
      }
    };

    const handleOpenAddModal = () => {
      setNewProfile({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        permissions: []
      });
      setShowAddModal(true);
    };

    const handleAddProfile = async () => {
      try {
        if (!newProfile.name?.trim()) {
          alert("❌ Name is required!");
          return;
        }
        if (!newProfile.email?.trim()) {
          alert("❌ Email is required!");
          return;
        }
        if (!newProfile.phone?.trim()) {
          alert("❌ Phone is required!");
          return;
        }
        if (newProfile.phone.length !== 10) {
  alert("❌ Mobile number must be exactly 10 digits!");
  return;
}
        if (!newProfile.password?.trim()) {
          alert("❌ Password is required!");
          return;
        }
        if (!newProfile.role) {
          alert("❌ Role is required!");
          return;
        }

        if (!user?.id) {
          alert("❌ Unable to determine your user ID. Please refresh and try again.");
          return;
        }

        const payload = {
          name: newProfile.name.trim(),
          username: newProfile.username?.trim() || null,
          email: newProfile.email.trim(),
          phone: `${newProfileCountryCode?.code || "+1"} ${newProfile.phone.trim()}`,
          password: newProfile.password,
          creatorUserId: user.id,
          role: newProfile.role.toUpperCase(),
          permissions: newProfile.permissions
        };

        console.log("➕ Adding child user with creator (logged-in user) ID:", user.id);
        console.log("📦 Payload:", JSON.stringify(payload, null, 2));

        const res = await axios.post(`http://localhost:8081/profiles`, payload, {
          headers: { 'Content-Type': 'application/json' }
        });

        console.log("✅ Child user added successfully:", res.data);

        setNewProfile({
          name: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          role: "",
          permissions: []
        });

        setShowAddModal(false);
        fetchUserProfiles();

        window.dispatchEvent(new CustomEvent("profileUpdated", {
          detail: { newProfile: res.data }
        }));

        alert(`✅ New user created under your profile!`);
        addActivityLog("Created", "User Management", `New user created — Name: "${newProfile.name}", Email: "${newProfile.email}", Role: "${newProfile.role}", Phone: "${newProfileCountryCode?.code} ${newProfile.phone}"`);
      } catch (error) {
        console.error('❌ Error adding user:', error);
        if (error.response) {
          console.log('==================== ERROR DETAILS ====================');
          console.log('Status Code:', error.response.status);
          console.log('Status Text:', error.response.statusText);
          console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
          console.log('=======================================================');

          const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown server error';
          alert(`❌ Failed to add user:\n\n${errorMessage}`);
        } else if (error.request) {
          console.error('❌ No response from server');
          alert('❌ No response from server. Please check if backend is running.');
        } else {
          console.error('❌ Error:', error.message);
          alert(`❌ Error: ${error.message}`);
        }
      }
    };

    const handleLogout = () => {
  addActivityLog("Logout", "Auth", `User logged out — Name: ${user?.name}, Role: ${user?.role}`);
  setTimeout(() => {
    localStorage.removeItem("user");
    navigate("/login");
  }, 300);
};

  
  const normalizeDate = (val) => {
  if (!val) return "";
  return val.toString().split("T")[0];
};

    // Handle ITAR Order form submission
   const handleSaveItarOrder = async () => {
  try {
    const isOther = itarOrderForm.manufacturerName?.toLowerCase() === 'other';

    const payload = {
      orderDate: itarOrderForm.orderDate || null,
      estNo: itarOrderForm.estNo || null,
      productType: itarOrderForm.productType || null,
      manufacturerName: itarOrderForm.manufacturerName || null,
      partNumber: isOther ? null : (itarOrderForm.partNumber || null),
      specialRequest: isOther ? (itarOrderForm.specialRequest || null) : null,
      qty: itarOrderForm.productType === 'services' ? null : (itarOrderForm.qty || null),
      serialNumber: isOther ? null : (itarOrderForm.serialNumber || null),
      location: itarOrderForm.location || null,
      itarNo: itarOrderForm.itarNo || null,
      shipDate: itarOrderForm.shipDate || null,
      invoiceNo: itarOrderForm.invoiceNo || null,
      orderStatus: itarOrderForm.orderStatus || null,
      username: editingItarOrderId
  ? (itarOrderForm.username || null)          
  : (user?.username || user?.name || null),
      remark: itarOrderForm.remark || null,
      createdByUserId: user?.id || null,
      items: itarItemRows.map(row => {
        const rowIsOther = row.manufacturerName?.toLowerCase() === 'other';
        const rowIsServices = row.productType?.toLowerCase() === 'services';
        return {
          ...row,
          partNumber:     rowIsOther    ? null : (row.partNumber || null),
          specialRequest: rowIsOther    ? (row.specialRequest || null) : null,
          qty:            rowIsServices ? null : (row.qty || null),
          serialNumber:   rowIsOther    ? null : (row.serialNumber || null),
        };
      })
    };

    if (editingItarOrderId) {
      const oldOrder = itarOrders.find(o => o.id === editingItarOrderId);
      console.log("ITAR oldOrder remark:", oldOrder?.remark);
console.log("ITAR oldOrder comment:", oldOrder?.comment);
      await axios.put(`http://localhost:8081/orders/itar/${editingItarOrderId}`, payload);

      const changes = [];
      if (oldOrder?.est_no !== itarOrderForm.estNo) changes.push(`Est#: "${oldOrder?.est_no}" → "${itarOrderForm.estNo}"`);
      if (normalizeDate(oldOrder?.order_date) !== normalizeDate(itarOrderForm.orderDate)) changes.push(`Order Date: "${normalizeDate(oldOrder?.order_date)}" → "${normalizeDate(itarOrderForm.orderDate)}"`);
      if (oldOrder?.product_type !== itarOrderForm.productType) changes.push(`Product: "${oldOrder?.product_type}" → "${itarOrderForm.productType}"`);
      if (oldOrder?.manufacturer_name !== itarOrderForm.manufacturerName) changes.push(`Manufacturer: "${oldOrder?.manufacturer_name}" → "${itarOrderForm.manufacturerName}"`);
      if ((oldOrder?.part_number ?? "") !== (itarOrderForm.partNumber ?? "")) changes.push(`Part#: "${oldOrder?.part_number ?? ""}" → "${itarOrderForm.partNumber ?? ""}"`)
      if ((oldOrder?.qty ?? "") !== (itarOrderForm.qty ?? "")) changes.push(`QTY: "${oldOrder?.qty ?? ""}" → "${itarOrderForm.qty ?? ""}"`)
      if ((oldOrder?.serial_number ?? "") !== (itarOrderForm.serialNumber ?? "")) changes.push(`S.N.: "${oldOrder?.serial_number ?? ""}" → "${itarOrderForm.serialNumber ?? ""}"`)
      if ((oldOrder?.special_request ?? "") !== (itarOrderForm.specialRequest ?? "")) changes.push(`Special Request: "${oldOrder?.special_request ?? ""}" → "${itarOrderForm.specialRequest ?? ""}"`);
      if (oldOrder?.location !== itarOrderForm.location) changes.push(`Location: "${oldOrder?.location}" → "${itarOrderForm.location}"`);
      if (oldOrder?.itar_no !== itarOrderForm.itarNo) changes.push(`ITAR#: "${oldOrder?.itar_no}" → "${itarOrderForm.itarNo}"`);
      if (normalizeDate(oldOrder?.ship_date) !== normalizeDate(itarOrderForm.shipDate)) changes.push(`Ship Date: "${normalizeDate(oldOrder?.ship_date)}" → "${normalizeDate(itarOrderForm.shipDate)}"`);  
      if (oldOrder?.invoice_no !== itarOrderForm.invoiceNo) changes.push(`Invoice#: "${oldOrder?.invoice_no}" → "${itarOrderForm.invoiceNo}"`);
      if (oldOrder?.order_status !== itarOrderForm.orderStatus) changes.push(`Status: "${oldOrder?.order_status}" → "${itarOrderForm.orderStatus}"`);
      if ((oldOrder?.remark ?? oldOrder?.comment ?? '') !== (itarOrderForm.remark ?? ''))
  changes.push(`Remark: "${oldOrder?.remark || oldOrder?.comment || ''}" → "${itarOrderForm.remark ?? ''}"`);

const existingRowIds = (oldOrder?.items || []).map(r => r.id);
const currentRowIds = itarItemRows.map(r => r.id);

// ✅ Naye rows — jo pehle nahi the
const newlyAddedRows = itarItemRows.filter(r => !existingRowIds.includes(r.id));

// ✅ Delete hue rows — jo pehle the ab nahi hain
const deletedRows = (oldOrder?.items || []).filter(r => !currentRowIds.includes(r.id));

// ✅ Naye items ka log
if (newlyAddedRows.length > 0) {
  const itemsSummary = newlyAddedRows.map((row, idx) =>
    `Item ${idx + 1}: [Type: ${row.productType || "-"}, Manufacturer: "${row.manufacturerName || "-"}", Part#: "${row.partNumber || row.specialRequest || "-"}", QTY: ${row.qty || "-"}, S.N.: ${row.serialNumber || "-"}]`
  ).join(" | ");

  addActivityLog(
    "Created",
    "ITAR Order Item",
    `${newlyAddedRows.length} new inline item(s) added — ${itemsSummary}`
  );
}

// ✅ Delete hue items ka log
if (deletedRows.length > 0) {
 const deletedSummary = deletedRows.map((row, idx) =>
  `Item ${idx + 1}: [Type: ${row.product_type || row.productType || "-"}, Manufacturer: "${row.manufacturer_name || row.manufacturerName || "-"}", Part#: "${row.part_number || row.partNumber || row.special_request || row.specialRequest || "-"}", QTY: ${row.qty || "-"}, S.N.: ${row.serial_number || row.serialNumber || "-"}]`
).join(" | ");

  addActivityLog(
    "Deleted",
    "ITAR Order Item",
    `${deletedRows.length} inline item(s) removed — ${deletedSummary}`
  );
}

// ✅ Order update ka log sirf real changes par
if (changes.length > 0) {
  addActivityLog("Updated", "ITAR Order", `ITAR Order updated — ${changes.join(", ")}`);
}
      
      
      // ✅ Reset + fetch + redirect
      setItarOrderForm({
        orderDate: '', estNo: '', productType: '', manufacturerName: '',
        partNumber: '', specialRequest: '', qty: '', serialNumber: '',
        location: '', itarNo: '', shipDate: '', invoiceNo: '', orderStatus: '', username: '' , remark: ''
      });
      setItarItemRows([]);
      fetchItarOrders();
      setEditingItarOrderId(null);
      alert("✅ ITAR Order updated successfully!");
      setActiveOrdersPage('itar-list'); // ✅ sabse last

    } else {
      await axios.post('http://localhost:8081/orders/itar', payload);
      addActivityLog(
        "Created", "ITAR Order",
        `New ITAR Order created — Est#: ${itarOrderForm.estNo}, Order Date: ${itarOrderForm.orderDate}, Product: ${itarOrderForm.productType}, Manufacturer: ${itarOrderForm.manufacturerName}, ${isOther ? `Special Request: ${itarOrderForm.specialRequest}` : `Part#: ${itarOrderForm.partNumber}`}, QTY: ${itarOrderForm.qty}, S.N.: ${itarOrderForm.serialNumber}, Location: ${itarOrderForm.location}, ITAR#: ${itarOrderForm.itarNo}, Ship Date: ${itarOrderForm.shipDate}, Invoice#: ${itarOrderForm.invoiceNo}, Status: ${itarOrderForm.orderStatus}`
      );

      // ✅ Reset + fetch + redirect
      setItarOrderForm({
        orderDate: '', estNo: '', productType: '', manufacturerName: '',
        partNumber: '', specialRequest: '', qty: '', serialNumber: '',
        location: '', itarNo: '', shipDate: '', invoiceNo: '', orderStatus: '', username: '' ,remark: ''
      });
      setItarItemRows([]);
      fetchItarOrders();
      alert("✅ ITAR Order saved successfully!");
      setActiveOrdersPage('itar-list'); // ✅ sabse last
    }

  } catch (error) {
    console.error('❌ Error saving ITAR order:', error);
    alert(`❌ Failed to save: ${error.response?.data?.error || error.message}`);
  }
};


// Current logged in user
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const isSuperAdmin = currentUser?.role?.toUpperCase() === 'SUPERADMIN';
const currentUsername = currentUser?.username || currentUser?.name || '';

console.log('Current User:', currentUser);
console.log('Role:', currentUser?.role);
console.log('isSuperAdmin:', isSuperAdmin);

const fetchItarOrders = useCallback(() => {
  axios.get('http://localhost:8081/orders/itar')
    .then((res) => {
      const data = res.data || [];              // ✅ hamesha update karo
      setItarOrders(data);
      localStorage.setItem('itarOrders', JSON.stringify(data));
    })
    .catch(() => {
      try {
        const saved = localStorage.getItem('itarOrders');
        if (saved) setItarOrders(JSON.parse(saved));
      } catch { setItarOrders([]); }
    });
}, []);

const fetchHardwareOrders = useCallback(() => {
  axios.get('http://localhost:8081/orders/hardware')
    .then((res) => {
      const data = res.data || [];
      setHardwareOrders(data);
      localStorage.setItem('hardwareOrders', JSON.stringify(data));
    })
    .catch(() => {
      try {
        const saved = localStorage.getItem('hardwareOrders');
        if (saved) setHardwareOrders(JSON.parse(saved));
      } catch { setHardwareOrders([]); }
    });
}, []);



const fetchAvPosOrders = useCallback(() => {
  axios.get('http://localhost:8081/orders/avpos')
    .then((res) => {
      const data = res.data || [];       // ✅ length check nahi, filter nahi
      setAvPosOrders(data);
      localStorage.setItem('avPosOrders', JSON.stringify(data));
    })
    .catch(() => {
      try {
        const saved = localStorage.getItem('avPosOrders');
        if (saved) setAvPosOrders(JSON.parse(saved));
      } catch { setAvPosOrders([]); }
    });
}, []);  

const fetchHardwareSoftwarePosOrders = useCallback(() => {
  axios.get('http://localhost:8081/orders/hwswpos')
    .then((res) => {
      const data = res.data || [];       // ✅ length check nahi, username filter nahi
      setHardwareSoftwarePosOrders(data);
      localStorage.setItem('hardwareSoftwarePosOrders', JSON.stringify(data));
    })
    .catch(() => {
      try {
        const saved = localStorage.getItem('hardwareSoftwarePosOrders');
        if (saved) setHardwareSoftwarePosOrders(JSON.parse(saved));
      } catch { setHardwareSoftwarePosOrders([]); }
    });
}, []);  


    const handleResetItarForm = () => {
  setItarOrderForm({
    orderDate: '', estNo: '', productType: '', manufacturerName: '',
    partNumber: '',  specialRequest: '', qty: '', serialNumber: '', location: '',
    itarNo: '', shipDate: '', invoiceNo: '', orderStatus: '', username: ''
  }); 
  setItarItemRows([]);
  setEditingItarOrderId(null);
};

    const handleAddAvPosFile = () => {
    const newId = avPosFileInputs.length + 1;
    setAvPosFileInputs([...avPosFileInputs, { id: newId }]);
  };

  const handleRemoveAvPosFile = (idToRemove) => {
    setAvPosFileInputs(avPosFileInputs.filter(input => input.id !== idToRemove));
  };
    const handleDeleteItarOrder = async (id) => {
  if (window.confirm("Are you sure you want to delete this ITAR order?")) {
    try {
      const order = itarOrders.find(o => o.id === id);
      await axios.delete(`http://localhost:8081/orders/itar/${id}`);
      addActivityLog("Deleted", "ITAR Order", `ITAR Order deleted — Est#: ${order?.est_no || id}`);
      alert("✅ ITAR Order deleted successfully!");
      fetchItarOrders();
    } catch (error) {
      console.error('❌ Error deleting ITAR order:', error);
      alert(`❌ Failed to delete: ${error.response?.data?.error || error.message}`);
    }
  }
};

    // Filter ITAR orders for list view
    const filteredItarOrders = itarOrders.filter(order => {
  const searchLower = listSearchTerm.toLowerCase();
  return (
    (order.itar_no || '').toLowerCase().includes(searchLower) ||
    (order.invoice_no || '').toLowerCase().includes(searchLower) ||
    (order.order_status || '').toLowerCase().includes(searchLower) ||
    (order.location || '').toLowerCase().includes(searchLower)
  );
});

    // Filter ITAR orders for report view
    const getFilteredReportOrders = () => {
  return itarOrders.filter(order => {
    let matches = true;
    if (reportFilters.productType && order.product_type !== reportFilters.productType) matches = false;
    if (reportFilters.manufacturerName && order.manufacturer_name !== reportFilters.manufacturerName) matches = false;
    if (reportFilters.partNumber && order.part_number !== reportFilters.partNumber) matches = false;
    if (reportFilters.orderStatus && order.order_status !== reportFilters.orderStatus) matches = false;
    if (reportFilters.location && order.location !== reportFilters.location) matches = false;
    return matches;
  });
};

   const handleSaveHardwareOrder = async () => {
  try {
    const isOther = hardwareOrderForm.manufacturerName?.toLowerCase() === 'other';
    const payload = {
  orderDate: hardwareOrderForm.orderDate || null,
  estNo: hardwareOrderForm.estNo || null,
  assignedUsername: editingHardwareOrderId
  ? (hardwareOrderForm.selectedUser
      ? (data.find(p => p.id === parseInt(hardwareOrderForm.selectedUser))?.username || null)
      : (hardwareOrders.find(o => o.id === editingHardwareOrderId)?.assigned_username || null))
  : (hardwareOrderForm.selectedUser
      ? (data.find(p => p.id === parseInt(hardwareOrderForm.selectedUser))?.username || null)
      : (user?.username || user?.name || null)),
  productType: hardwareOrderForm.productType || null,
  manufacturerName: hardwareOrderForm.manufacturerName || null,
  partNumber: isOther ? null : (hardwareOrderForm.partNumber || null),
  specialRequest: isOther ? (hardwareOrderForm.specialRequest || null) : null,
  qty: hardwareOrderForm.productType === 'services' ? null : (hardwareOrderForm.qty || null),
  serialNumber: isOther ? null : (hardwareOrderForm.serialNumber || null),
      location: hardwareOrderForm.location || null,
      hardwareNo: hardwareOrderForm.hardwareNo || null,
      shipDate: hardwareOrderForm.shipDate || null,
      invoiceNo: hardwareOrderForm.invoiceNo || null,
      orderStatus: hardwareOrderForm.orderStatus || null,
      createdByUserId: user?.id || null,
      remark: hardwareOrderForm.remark || null, 
     items: hardwareItemRows.map(row => {
  const rowIsOther = row.manufacturerName?.toLowerCase() === 'other';
  const rowIsServices = row.productType?.toLowerCase() === 'services';
  return {
    ...row,
    partNumber:     rowIsOther    ? null : (row.partNumber || null),
    specialRequest: rowIsOther    ? (row.specialRequest || null) : null,
    qty:            rowIsServices ? null : (row.qty || null),
    serialNumber:   rowIsOther    ? null : (row.serialNumber || null),
  };
})
    };

    if (editingHardwareOrderId) {
      const oldOrder = hardwareOrders.find(o => o.id === editingHardwareOrderId);
      console.log("HW oldOrder remark:", oldOrder?.remark);
console.log("HW oldOrder comment:", oldOrder?.comment);
      console.log("oldOrder items sample:", oldOrder?.items?.[0]);
      await axios.put(`http://localhost:8081/orders/hardware/${editingHardwareOrderId}`, payload);
      
      const changes = [];
      if (oldOrder?.est_no !== hardwareOrderForm.estNo) changes.push(`Est#: "${oldOrder?.est_no}" → "${hardwareOrderForm.estNo}"`);
      if (normalizeDate(oldOrder?.order_date) !== normalizeDate(hardwareOrderForm.orderDate)) changes.push(`Order Date: "${normalizeDate(oldOrder?.order_date)}" → "${normalizeDate(hardwareOrderForm.orderDate)}"`);
      if (oldOrder?.product_type !== hardwareOrderForm.productType) changes.push(`Product: "${oldOrder?.product_type}" → "${hardwareOrderForm.productType}"`);
      if (oldOrder?.manufacturer_name !== hardwareOrderForm.manufacturerName) changes.push(`Manufacturer: "${oldOrder?.manufacturer_name}" → "${hardwareOrderForm.manufacturerName}"`);
      if (oldOrder?.part_number !== hardwareOrderForm.partNumber) changes.push(`Part#: "${oldOrder?.part_number}" → "${hardwareOrderForm.partNumber}"`);

      // ✅ FIX 1: Normalize qty to string for safe comparison
      if (String(oldOrder?.qty ?? '') !== String(hardwareOrderForm.qty ?? '')) changes.push(`QTY: "${oldOrder?.qty}" → "${hardwareOrderForm.qty}"`);

      if (oldOrder?.serial_number !== hardwareOrderForm.serialNumber) changes.push(`S.N.: "${oldOrder?.serial_number}" → "${hardwareOrderForm.serialNumber}"`);
      if (oldOrder?.location !== hardwareOrderForm.location) changes.push(`Location: "${oldOrder?.location}" → "${hardwareOrderForm.location}"`);
      if (oldOrder?.hardware_no !== hardwareOrderForm.hardwareNo) changes.push(`Hardware#: "${oldOrder?.hardware_no}" → "${hardwareOrderForm.hardwareNo}"`);
      if (normalizeDate(oldOrder?.ship_date) !== normalizeDate(hardwareOrderForm.shipDate)) changes.push(`Ship Date: "${normalizeDate(oldOrder?.ship_date)}" → "${normalizeDate(hardwareOrderForm.shipDate)}"`);
      if (oldOrder?.invoice_no !== hardwareOrderForm.invoiceNo) changes.push(`Invoice#: "${oldOrder?.invoice_no}" → "${hardwareOrderForm.invoiceNo}"`);
      if (oldOrder?.order_status !== hardwareOrderForm.orderStatus) changes.push(`Status: "${oldOrder?.order_status}" → "${hardwareOrderForm.orderStatus}"`);
      if ((oldOrder?.remark ?? oldOrder?.comment ?? '') !== (hardwareOrderForm.remark ?? ''))
  changes.push(`Remark: "${oldOrder?.remark || oldOrder?.comment || ''}" → "${hardwareOrderForm.remark ?? ''}"`);

      const existingHwRowIds = (oldOrder?.items || []).map(r => r.id);
      const currentHwRowIds = hardwareItemRows.map(r => r.id);

      const newlyAddedHwRows = hardwareItemRows.filter(r => !existingHwRowIds.includes(r.id));
      const deletedHwRows = (oldOrder?.items || []).filter(r => !currentHwRowIds.includes(r.id));

      // ✅ FIX 2: Detect updated inline rows (same id, but fields changed)
      const updatedHwRows = hardwareItemRows.filter(currentRow => {
  const oldRow = (oldOrder?.items || []).find(r => r.id === currentRow.id);
  if (!oldRow) return false;

  return (
    String(oldRow.productType ?? '') !== String(currentRow.productType ?? '') ||
    String(oldRow.manufacturerName ?? '') !== String(currentRow.manufacturerName ?? '') ||
    String(oldRow.partNumber ?? '') !== String(currentRow.partNumber ?? '') ||
    String(oldRow.qty ?? '') !== String(currentRow.qty ?? '') ||
    String(oldRow.serialNumber ?? '') !== String(currentRow.serialNumber ?? '')
  );
});

      if (newlyAddedHwRows.length > 0) {
        const summary = newlyAddedHwRows.map((row, idx) =>
          `Item ${idx + 1}: [Type: ${row.productType || "-"}, Manufacturer: "${row.manufacturerName || "-"}", Part#: "${row.partNumber || "-"}", QTY: ${row.qty || "-"}, S.N.: ${row.serialNumber || "-"}]`
        ).join(" | ");
        addActivityLog("Created", "Hardware Order Item", `${newlyAddedHwRows.length} new inline item(s) added — ${summary}`);
      }

      if (deletedHwRows.length > 0) {
        const deletedSummary = deletedHwRows.map((row, idx) =>
          `Item ${idx + 1}: [Type: ${row.product_type || "-"}, Manufacturer: "${row.manufacturer_name || "-"}", Part#: "${row.part_number || "-"}", QTY: ${row.qty || "-"}, S.N.: ${row.serial_number || "-"}]`
        ).join(" | ");
        addActivityLog("Deleted", "Hardware Order Item", `${deletedHwRows.length} inline item(s) removed — ${deletedSummary}`);
      }

      // ✅ FIX 2 LOG: Log updated inline rows with before → after values
      if (updatedHwRows.length > 0) {
  const updatedSummary = updatedHwRows.map((currentRow, idx) => {
    const oldRow = (oldOrder?.items || []).find(r => r.id === currentRow.id);
    const fieldChanges = [];

    if (String(oldRow.productType ?? '') !== String(currentRow.productType ?? ''))
      fieldChanges.push(`Type: "${oldRow.productType}" → "${currentRow.productType}"`);

    if (String(oldRow.manufacturerName ?? '') !== String(currentRow.manufacturerName ?? ''))
      fieldChanges.push(`Manufacturer: "${oldRow.manufacturerName}" → "${currentRow.manufacturerName}"`);

    if (String(oldRow.partNumber ?? '') !== String(currentRow.partNumber ?? ''))
      fieldChanges.push(`Part#: "${oldRow.partNumber}" → "${currentRow.partNumber}"`);

    if (String(oldRow.qty ?? '') !== String(currentRow.qty ?? ''))
      fieldChanges.push(`QTY: "${oldRow.qty}" → "${currentRow.qty}"`);

    if (String(oldRow.serialNumber ?? '') !== String(currentRow.serialNumber ?? ''))
      fieldChanges.push(`S.N.: "${oldRow.serialNumber}" → "${currentRow.serialNumber}"`);

    return `Item ${idx + 1}: [${fieldChanges.join(", ")}]`;
  }).join(" | ");

  addActivityLog("Updated", "Hardware Order Item", `${updatedHwRows.length} inline item(s) modified — ${updatedSummary}`);
}

      if (changes.length > 0) {
        addActivityLog("Updated", "Hardware Order", `Hardware Order updated — ${changes.join(", ")}`);
      }

      alert("✅ Hardware Order updated successfully!");
      setEditingHardwareOrderId(null);
      setActiveOrdersPage('hardware-orders-list');
    } else {
      await axios.post('http://localhost:8081/orders/hardware', payload);
      addActivityLog("Created", "Hardware Order", `New Hardware Order created — Est#: ${hardwareOrderForm.estNo}, Order Date: ${hardwareOrderForm.orderDate}, Product: ${hardwareOrderForm.productType}, Manufacturer: ${hardwareOrderForm.manufacturerName}, Part#: ${hardwareOrderForm.partNumber}, QTY: ${hardwareOrderForm.qty}, S.N.: ${hardwareOrderForm.serialNumber}, Location: ${hardwareOrderForm.location}, Hardware#: ${hardwareOrderForm.hardwareNo}, Ship Date: ${hardwareOrderForm.shipDate}, Invoice#: ${hardwareOrderForm.invoiceNo}, Status: ${hardwareOrderForm.orderStatus}`);
      alert("✅ Hardware Order saved successfully!");
      setActiveOrdersPage('hardware-orders-list');
    }

    setHardwareOrderForm({
      orderDate: '', estNo: '', selectedUser: '', productType: '',
      manufacturerName: '', partNumber: '', qty: '', serialNumber: '',
      location: '', hardwareNo: '', shipDate: '', invoiceNo: '', orderStatus: '' , remark: '' 
    });

    fetchHardwareOrders();

  } catch (error) {
    console.error('❌ Error saving hardware order:', error);
    alert(`❌ Failed to save: ${error.response?.data?.error || error.message}`);
  }
};

  const handleResetHardwareForm = () => {
  setEditingHardwareOrderId(null);
  setHardwareItemRows([]);
  setHardwareOrderForm({
    orderDate: '', estNo: '', selectedUser: '', productType: '',
    manufacturerName: '', partNumber: '', qty: '', serialNumber: '',
    location: '', hardwareNo: '', shipDate: '', invoiceNo: '', orderStatus: '' , remark: ''
  });
};

 const handleDeleteHardwareOrder = async (id) => {
  if (window.confirm("Are you sure you want to delete this Hardware order?")) {
    try {
      const order = hardwareOrders.find(o => o.id === id);
      await axios.delete(`http://localhost:8081/orders/hardware/${id}`);
      addActivityLog("Deleted", "Hardware Order", `Hardware Order deleted — Est#: ${order?.est_no || id}`);
      alert("✅ Hardware Order deleted successfully!");
      fetchHardwareOrders();
    } catch (error) {
      console.error('❌ Error deleting hardware order:', error);
      alert(`❌ Failed to delete: ${error.response?.data?.error || error.message}`);
    }
  }
};

  // Filter Hardware orders for list view
 const filteredHardwareOrders = hardwareOrders.filter(order => {
  const searchLower = hardwareListSearchTerm.toLowerCase();
  return (
    (order.hardware_no || '').toLowerCase().includes(searchLower) ||
    (order.invoice_no || '').toLowerCase().includes(searchLower) ||
    (order.order_status || '').toLowerCase().includes(searchLower) ||
    (order.location || '').toLowerCase().includes(searchLower)
  );
});

  // Filter Hardware orders for report view
  const getFilteredHardwareReportOrders = () => {
  return hardwareOrders.filter(order => {
    let matches = true;
    if (hardwareReportFilters.productType && order.product_type !== hardwareReportFilters.productType) matches = false;
    if (hardwareReportFilters.manufacturerName && order.manufacturer_name !== hardwareReportFilters.manufacturerName) matches = false;
    if (hardwareReportFilters.partNumber && order.part_number !== hardwareReportFilters.partNumber) matches = false;
    if (hardwareReportFilters.orderStatus && order.order_status !== hardwareReportFilters.orderStatus) matches = false;
    if (hardwareReportFilters.location && order.location !== hardwareReportFilters.location) matches = false;
    return matches;
  });
};

// ✅ YAHI RAKHO
useEffect(() => {
  if (activeOrdersPage === 'hardware-orders-detail' && selectedHardwareOrder) {
    const orderId = selectedHardwareOrder.id || selectedHardwareOrder.hardware_id;

    axios.get(`http://localhost:8081/warranty/order/${orderId}`)
      .then(res => {
        const loaded = {};
        res.data.forEach(w => {
          const key = String(w.hardware_order_inline_id);
          loaded[key] = {
            serialNumber: w.serial_number,
            productName:  w.product_name,
            purchaseDate: w.purchase_date ? w.purchase_date.substring(0, 10) : '',
            expiryDate:   w.expiry_date   ? w.expiry_date.substring(0, 10)   : '',
          };
        });
        setWarranties(loaded);
      })
      .catch(err => console.error('Warranties load failed:', err));
  }
}, [activeOrdersPage, selectedHardwareOrder]);


 const handleSaveAvPosOrder = async () => {
  try {
    const isOther = avPosOrderForm.manufacturerName?.toLowerCase() === 'other';

const payload = {
  orderDate: avPosOrderForm.orderDate || null,
  estNo: avPosOrderForm.estNo || null,
  productType: avPosOrderForm.productType || null,
  assignedUsername: editingAvPosOrderId
  // Edit mode: user ne koi select kiya to naya, warna purana preserve karo
  ? (avPosOrderForm.userId
      ? (data.find(p => p.id === parseInt(avPosOrderForm.userId))?.username || null)
      : (avPosOrders.find(o => o.id === editingAvPosOrderId)?.assigned_username || null))
  // Create mode: user ne select kiya to wo, warna logged-in user
  : (avPosOrderForm.userId
      ? (data.find(p => p.id === parseInt(avPosOrderForm.userId))?.username || null)
      : (user?.username || user?.name || null)),
  manufacturerName: avPosOrderForm.manufacturerName || null,
  partNumber: isOther ? null : (avPosOrderForm.partNumber || null),
  specialRequest: isOther ? (avPosOrderForm.specialRequest || null) : null,
  qty: avPosOrderForm.productType === 'services' ? null : (avPosOrderForm.qty !== '' && avPosOrderForm.qty != null ? avPosOrderForm.qty : null),
  serialNumber: isOther ? null : (avPosOrderForm.serialNumber || null),
      location: avPosOrderForm.location || null,
      avPosNo: avPosOrderForm.avPosNo || null,
      shipDate: avPosOrderForm.shipDate || null,
      invoiceNo: avPosOrderForm.invoiceNo || null,
      orderStatus: avPosOrderForm.orderStatus || null,
      sow: avPosOrderForm.sow || null,
      createdByUserId: user?.id || null,
      remark: avPosOrderForm.remark || null,
      items: avPosItemRows.map(row => {
  const rowIsOther = row.manufacturerName?.toLowerCase() === 'other';
  const rowIsServices = row.productType?.toLowerCase() === 'services';
  return {
    ...row,
    partNumber:     rowIsOther    ? null : (row.partNumber || null),
    specialRequest: rowIsOther    ? (row.specialRequest || null) : null,
    qty:            rowIsServices ? null : (row.qty || null),
    serialNumber:   rowIsOther    ? null : (row.serialNumber || null),
  };
})
    };

    if (editingAvPosOrderId) {
      const oldOrder = avPosOrders.find(o => o.id === editingAvPosOrderId);

      await axios.put(`http://localhost:8081/orders/avpos/${editingAvPosOrderId}`, payload);

      // ✅ Edit pe bhi nayi files upload karo
      await uploadAvPosFiles(editingAvPosOrderId);

      const changes = [];
      const normalizeDate = (val) => {
        if (!val) return '';
        if (typeof val === 'string') return val.substring(0, 10);
        return new Date(val).toLocaleDateString('en-CA');
      };

      if (oldOrder?.est_no !== avPosOrderForm.estNo)
        changes.push(`Est#: "${oldOrder?.est_no}" → "${avPosOrderForm.estNo}"`);
      const oldOrderDate = normalizeDate(oldOrder?.order_date);
      const newOrderDate = avPosOrderForm.orderDate || '';
      if (oldOrderDate !== newOrderDate)
        changes.push(`Order Date: "${oldOrderDate}" → "${newOrderDate}"`);
      if (oldOrder?.product_type !== avPosOrderForm.productType)
        changes.push(`Product: "${oldOrder?.product_type}" → "${avPosOrderForm.productType}"`);
      if (oldOrder?.manufacturer_name !== avPosOrderForm.manufacturerName)
        changes.push(`Manufacturer: "${oldOrder?.manufacturer_name}" → "${avPosOrderForm.manufacturerName}"`);
      if (oldOrder?.part_number !== avPosOrderForm.partNumber)
        changes.push(`Part#: "${oldOrder?.part_number}" → "${avPosOrderForm.partNumber}"`);
      const oldAvQty = String(oldOrder?.qty ?? '');
      const newAvQty = String(avPosOrderForm.qty ?? '');
      if (oldAvQty !== newAvQty)
        changes.push(`QTY: "${oldAvQty}" → "${newAvQty}"`);
      if (oldOrder?.serial_number !== avPosOrderForm.serialNumber)
        changes.push(`S.N.: "${oldOrder?.serial_number}" → "${avPosOrderForm.serialNumber}"`);
      if (oldOrder?.location !== avPosOrderForm.location)
        changes.push(`Location: "${oldOrder?.location}" → "${avPosOrderForm.location}"`);
      if (oldOrder?.av_pos_no !== avPosOrderForm.avPosNo)
        changes.push(`PO#: "${oldOrder?.av_pos_no}" → "${avPosOrderForm.avPosNo}"`);
      const oldShipDate = normalizeDate(oldOrder?.ship_date);
      const newShipDate = avPosOrderForm.shipDate || '';
      if (oldShipDate !== newShipDate)
        changes.push(`Ship Date: "${oldShipDate}" → "${newShipDate}"`);
      if (oldOrder?.invoice_no !== avPosOrderForm.invoiceNo)
        changes.push(`Invoice#: "${oldOrder?.invoice_no}" → "${avPosOrderForm.invoiceNo}"`);
      if (oldOrder?.order_status !== avPosOrderForm.orderStatus)
        changes.push(`Status: "${oldOrder?.order_status}" → "${avPosOrderForm.orderStatus}"`);
      if ((oldOrder?.sow ?? '') !== (avPosOrderForm.sow ?? ''))
        changes.push(`SOW: "${oldOrder?.sow ?? ''}" → "${avPosOrderForm.sow ?? ''}"`);
      if ((oldOrder?.remark ?? oldOrder?.comment ?? '') !== (avPosOrderForm.remark ?? ''))
        changes.push(`Remark: "${oldOrder?.remark || oldOrder?.comment || ''}" → "${avPosOrderForm.remark ?? ''}"`);

      const existingAvRows = oldOrder?.items || [];
      const existingAvRowIds = existingAvRows.map(r => r.id);
      const currentAvRowIds = avPosItemRows.map(r => r.id);
      const newlyAddedAvRows = avPosItemRows.filter(r => !existingAvRowIds.includes(r.id));
      const deletedAvRows = existingAvRows.filter(r => !currentAvRowIds.includes(r.id));
      const modifiedAvRows = avPosItemRows.filter(r => {
        if (!existingAvRowIds.includes(r.id)) return false;
        const oldRow = existingAvRows.find(old => old.id === r.id);
        if (!oldRow) return false;
        return (
          (r.productType || r.product_type || '') !== (oldRow.product_type || oldRow.productType || '') ||
          (r.manufacturerName || r.manufacturer_name || '') !== (oldRow.manufacturer_name || oldRow.manufacturerName || '') ||
          (r.partNumber || r.part_number || '') !== (oldRow.part_number || oldRow.partNumber || '') ||
          String(r.qty ?? '') !== String(oldRow.qty ?? '') ||
          (r.serialNumber || r.serial_number || '') !== (oldRow.serial_number || oldRow.serialNumber || '')
        );
      });

      if (newlyAddedAvRows.length > 0) {
        const summary = newlyAddedAvRows.map((row, idx) =>
          `Item ${idx + 1}: [Type: ${row.productType || '-'}, Manufacturer: "${row.manufacturerName || '-'}", Part#: "${row.partNumber || '-'}", QTY: ${row.qty ?? '-'}, S.N.: "${row.serialNumber || '-'}"]`
        ).join(' | ');
        await addActivityLog('Created', 'AV Pos Order Item', `${newlyAddedAvRows.length} new inline item(s) added — ${summary}`);
      }
      if (deletedAvRows.length > 0) {
        const deletedSummary = deletedAvRows.map((row, idx) =>
          `Item ${idx + 1}: [Type: ${row.product_type || '-'}, Manufacturer: "${row.manufacturer_name || '-'}", Part#: "${row.part_number || '-'}", QTY: ${row.qty ?? '-'}, S.N.: "${row.serial_number || '-'}"]`
        ).join(' | ');
        await addActivityLog('Deleted', 'AV Pos Order Item', `${deletedAvRows.length} inline item(s) removed — ${deletedSummary}`);
      }
      if (modifiedAvRows.length > 0) {
        const modSummary = modifiedAvRows.map((row, idx) => {
          const oldRow = existingAvRows.find(old => old.id === row.id);
          const fieldChanges = [];
          if ((row.productType || row.product_type || '') !== (oldRow.product_type || oldRow.productType || ''))
            fieldChanges.push(`Type: "${oldRow.product_type || '-'}" → "${row.productType || '-'}"`);
          if ((row.manufacturerName || row.manufacturer_name || '') !== (oldRow.manufacturer_name || oldRow.manufacturerName || ''))
            fieldChanges.push(`Manufacturer: "${oldRow.manufacturer_name || '-'}" → "${row.manufacturerName || '-'}"`);
          if ((row.partNumber || row.part_number || '') !== (oldRow.part_number || oldRow.partNumber || ''))
            fieldChanges.push(`Part#: "${oldRow.part_number || '-'}" → "${row.partNumber || '-'}"`);
          if (String(row.qty ?? '') !== String(oldRow.qty ?? ''))
            fieldChanges.push(`QTY: "${oldRow.qty ?? '-'}" → "${row.qty ?? '-'}"`);
          if ((row.serialNumber || row.serial_number || '') !== (oldRow.serial_number || oldRow.serialNumber || ''))
            fieldChanges.push(`S.N.: "${oldRow.serial_number || '-'}" → "${row.serialNumber || '-'}"`);
          return `Item ${idx + 1}: [${fieldChanges.join(', ')}]`;
        }).join(' | ');
        await addActivityLog('Updated', 'AV Pos Order Item', `${modifiedAvRows.length} inline item(s) modified — ${modSummary}`);
      }
      if (changes.length > 0) {
        await addActivityLog('Updated', 'AV Pos Order', `AV Pos Order updated — ${changes.join(', ')}`);
      }

      setAvPosOrderForm({ orderDate: '', estNo: '', productType: '', userId: '', manufacturerName: '', partNumber: '', qty: '', serialNumber: '', location: '', avPosNo: '', shipDate: '', invoiceNo: '', orderStatus: '', sow: '', remark: '' });
      setAvPosItemRows([]);
      fetchAvPosOrders();
      setEditingAvPosOrderId(null);
      alert('✅ AV Pos Order updated successfully!');
      setActiveOrdersPage('av-pos-list');

    } else {
      // ✅ CREATE — pehle order save karo, phir files upload karo
      const createRes = await axios.post('http://localhost:8081/orders/avpos', payload);
      const newOrderId = createRes.data.id;

      // ✅ Files upload karo naye order ke saath
      await uploadAvPosFiles(newOrderId);

      await addActivityLog(
        'Created', 'AV Pos Order',
        `New AV Pos Order created — Est#: ${avPosOrderForm.estNo}, Order Date: ${avPosOrderForm.orderDate}, Product: ${avPosOrderForm.productType}, Manufacturer: ${avPosOrderForm.manufacturerName}, Part#: ${avPosOrderForm.partNumber}, QTY: ${avPosOrderForm.qty}, S.N.: ${avPosOrderForm.serialNumber}, Location: ${avPosOrderForm.location}, PO#: ${avPosOrderForm.avPosNo}, Ship Date: ${avPosOrderForm.shipDate}, Invoice#: ${avPosOrderForm.invoiceNo}, Status: ${avPosOrderForm.orderStatus}, SOW: ${avPosOrderForm.sow}`
      );

      setAvPosOrderForm({ orderDate: '', estNo: '', productType: '', userId: '', manufacturerName: '', partNumber: '', qty: '', serialNumber: '', location: '', avPosNo: '', shipDate: '', invoiceNo: '', orderStatus: '', sow: '', remark: '' });
      setAvPosItemRows([]);
      fetchAvPosOrders();
      alert('✅ AV Pos Order saved successfully!');
      setActiveOrdersPage('av-pos-list');
    }

  } catch (error) {
    console.error('❌ Error saving AV POS order:', error);
    alert(`❌ Failed to save: ${error.response?.data?.error || error.message}`);
  }
};

// ✅ handleResetAvPosForm — UPDATED
const handleResetAvPosForm = () => {
  setAvPosItemRows([]);
  setAvPosSelectedFiles([]);        // ✅ selected files clear
  setAvPosFileInputs([{ id: 1 }]); // ✅ file inputs reset
  setAvPosOrderForm({
    orderDate: '', estNo: '', productType: '', userId: '',
    manufacturerName: '', partNumber: '', qty: '', serialNumber: '',
    location: '', avPosNo: '', shipDate: '', invoiceNo: '', orderStatus: '', sow: '', remark: ''
  });
  setEditingAvPosOrderId(null);
};

  const handleDeleteAvPosOrder = async (id) => {
  if (window.confirm("Are you sure you want to delete this AV Pos order?")) {
    try {
      const order = avPosOrders.find(o => o.id === id);
      await axios.delete(`http://localhost:8081/orders/avpos/${id}`);
      await addActivityLog("Deleted", "AV Pos Order", `AV Pos Order deleted — PO#: ${order?.av_pos_no || id}`);
      alert("✅ AV Pos Order deleted successfully!");
      fetchAvPosOrders();
    } catch (error) {
      console.error('❌ Error deleting AV POS order:', error);
      alert(`❌ Failed to delete: ${error.response?.data?.error || error.message}`);
    }
  }
};



  // Filter AV Pos orders for list view
 const filteredAvPosOrders = avPosOrders.filter(order => {
  const searchLower = listSearchTerm.toLowerCase();
  return (
    (order.av_pos_no || '').toLowerCase().includes(searchLower) ||
    (order.invoice_no || '').toLowerCase().includes(searchLower) ||
    (order.order_status || '').toLowerCase().includes(searchLower) ||
    (order.location || '').toLowerCase().includes(searchLower) ||
    (order.sow || '').toLowerCase().includes(searchLower)
  );
});
  // Filter AV Pos orders for report view
 const getFilteredAvPosReportOrders = () => {
  return avPosOrders.filter(order => {
    let matches = true;
    if (avPosReportFilters.productType && order.product_type !== avPosReportFilters.productType) matches = false;
    if (avPosReportFilters.manufacturerName && order.manufacturer_name !== avPosReportFilters.manufacturerName) matches = false;
    if (avPosReportFilters.partNumber && order.part_number !== avPosReportFilters.partNumber) matches = false;
    if (avPosReportFilters.orderStatus && order.order_status !== avPosReportFilters.orderStatus) matches = false;
    if (avPosReportFilters.location && order.location !== avPosReportFilters.location) matches = false;
    return matches;
  });
};

   // ===================== HW/SW POS ORDER HANDLERS =====================
 const handleSaveHardwareSoftwarePosOrder = async () => {
  try {
    const selectedProfile = data.find(p => p.id === parseInt(hardwareSoftwarePosOrderForm.userId));
    
    const isOther = hardwareSoftwarePosOrderForm.manufacturerName?.toLowerCase() === 'other';

const payload = {
  orderDate: hardwareSoftwarePosOrderForm.orderDate || null,
  estNo: hardwareSoftwarePosOrderForm.estNo || null,
  productType: hardwareSoftwarePosOrderForm.productType || null,
 assignedUsername: editingHardwareSoftwarePosOrderId
  // Edit mode: user ne koi select kiya to naya, warna purana rakho
  ? (hardwareSoftwarePosOrderForm.userId
      ? (data.find(p => p.id === parseInt(hardwareSoftwarePosOrderForm.userId))?.username || null)
      : (hardwareSoftwarePosOrders.find(o => o.id === editingHardwareSoftwarePosOrderId)?.assigned_username || null))
  // Create mode: user ne select kiya to wo, warna logged-in user
  : (hardwareSoftwarePosOrderForm.userId
      ? (data.find(p => p.id === parseInt(hardwareSoftwarePosOrderForm.userId))?.username || null)
      : (user?.username || user?.name || null)),
  manufacturerName: hardwareSoftwarePosOrderForm.manufacturerName || null,
  partNumber: isOther ? null : (hardwareSoftwarePosOrderForm.partNumber || null),
  specialRequest: isOther ? (hardwareSoftwarePosOrderForm.specialRequest || null) : null,
  qty: hardwareSoftwarePosOrderForm.productType === 'services' ? null : (hardwareSoftwarePosOrderForm.qty || null),
  serialNumber: isOther ? null : (hardwareSoftwarePosOrderForm.serialNumber || null),
  location: hardwareSoftwarePosOrderForm.location || null,
  poNo: hardwareSoftwarePosOrderForm.poNo || null,
  shipDate: hardwareSoftwarePosOrderForm.shipDate || null,
  invoiceNo: hardwareSoftwarePosOrderForm.invoiceNo || null,
  orderStatus: hardwareSoftwarePosOrderForm.orderStatus || null,
  remark: hardwareSoftwarePosOrderForm.remark || null,
  createdByUserId: user?.id || null,
  items: hwSwPosItemRows.map(row => {
    const rowIsOther = row.manufacturerName?.toLowerCase() === 'other';
    const rowIsServices = row.productType?.toLowerCase() === 'services';
    return {
      ...row,
      partNumber:     rowIsOther    ? null : (row.partNumber || null),
      specialRequest: rowIsOther    ? (row.specialRequest || null) : null,
      qty:            rowIsServices ? null : (row.qty || null),
      serialNumber:   rowIsOther    ? null : (row.serialNumber || null),
    };
  })
};

    if (editingHardwareSoftwarePosOrderId) {
      const oldOrder = hardwareSoftwarePosOrders.find(o => o.id === editingHardwareSoftwarePosOrderId);
      await axios.put(`http://localhost:8081/orders/hwswpos/${editingHardwareSoftwarePosOrderId}`, payload);

      const changes = [];

      // ✅ FIX — consistent date normalization
      const normalizeDate = (val) => {
        if (!val) return '';
        if (typeof val === 'string') return val.substring(0, 10);
        return new Date(val).toLocaleDateString('en-CA');
      };

      if (oldOrder?.est_no !== hardwareSoftwarePosOrderForm.estNo)
        changes.push(`Est#: "${oldOrder?.est_no}" → "${hardwareSoftwarePosOrderForm.estNo}"`);

      const oldOrderDate = normalizeDate(oldOrder?.order_date);
      const newOrderDate = hardwareSoftwarePosOrderForm.orderDate || '';
      if (oldOrderDate !== newOrderDate)
        changes.push(`Order Date: "${oldOrderDate}" → "${newOrderDate}"`);

      if (oldOrder?.product_type !== hardwareSoftwarePosOrderForm.productType)
        changes.push(`Product: "${oldOrder?.product_type}" → "${hardwareSoftwarePosOrderForm.productType}"`);
      if (oldOrder?.manufacturer_name !== hardwareSoftwarePosOrderForm.manufacturerName)
        changes.push(`Manufacturer: "${oldOrder?.manufacturer_name}" → "${hardwareSoftwarePosOrderForm.manufacturerName}"`);
      if (oldOrder?.part_number !== hardwareSoftwarePosOrderForm.partNumber)
        changes.push(`Part#: "${oldOrder?.part_number}" → "${hardwareSoftwarePosOrderForm.partNumber}"`);

      // ✅ FIX — qty string comparison
      if (String(oldOrder?.qty ?? '') !== String(hardwareSoftwarePosOrderForm.qty ?? ''))
        changes.push(`QTY: "${oldOrder?.qty}" → "${hardwareSoftwarePosOrderForm.qty}"`);

      if (oldOrder?.serial_number !== hardwareSoftwarePosOrderForm.serialNumber)
        changes.push(`S.N.: "${oldOrder?.serial_number}" → "${hardwareSoftwarePosOrderForm.serialNumber}"`);
      if (oldOrder?.location !== hardwareSoftwarePosOrderForm.location)
        changes.push(`Location: "${oldOrder?.location}" → "${hardwareSoftwarePosOrderForm.location}"`);
      if (oldOrder?.po_no !== hardwareSoftwarePosOrderForm.poNo)
        changes.push(`PO#: "${oldOrder?.po_no}" → "${hardwareSoftwarePosOrderForm.poNo}"`);

      const oldShipDate = normalizeDate(oldOrder?.ship_date);
      const newShipDate = hardwareSoftwarePosOrderForm.shipDate || '';
      if (oldShipDate !== newShipDate)
        changes.push(`Ship Date: "${oldShipDate}" → "${newShipDate}"`);

      if (oldOrder?.invoice_no !== hardwareSoftwarePosOrderForm.invoiceNo)
        changes.push(`Invoice#: "${oldOrder?.invoice_no}" → "${hardwareSoftwarePosOrderForm.invoiceNo}"`);
      if (oldOrder?.order_status !== hardwareSoftwarePosOrderForm.orderStatus)
        changes.push(`Status: "${oldOrder?.order_status}" → "${hardwareSoftwarePosOrderForm.orderStatus}"`);
      if ((oldOrder?.remark ?? '') !== (hardwareSoftwarePosOrderForm.remark ?? ''))
  changes.push(`Remark: "${oldOrder?.remark ?? ''}" → "${hardwareSoftwarePosOrderForm.remark ?? ''}"`);

      // ✅ Inline items tracking
      const existingHwSwRowIds = (oldOrder?.items || []).map(r => r.id);
      const currentHwSwRowIds = hwSwPosItemRows.map(r => r.id);

      const newlyAddedHwSwRows = hwSwPosItemRows.filter(r => !existingHwSwRowIds.includes(r.id));
      const deletedHwSwRows = (oldOrder?.items || []).filter(r => !currentHwSwRowIds.includes(r.id));

      // ✅ FIX — modified rows detect karo
      const modifiedHwSwRows = hwSwPosItemRows.filter(r => {
        if (!existingHwSwRowIds.includes(r.id)) return false;
        const oldRow = (oldOrder?.items || []).find(old => old.id === r.id);
        if (!oldRow) return false;
        return (
          (r.productType || r.product_type || '') !== (oldRow.product_type || oldRow.productType || '') ||
          (r.manufacturerName || r.manufacturer_name || '') !== (oldRow.manufacturer_name || oldRow.manufacturerName || '') ||
          (r.partNumber || r.part_number || '') !== (oldRow.part_number || oldRow.partNumber || '') ||
          String(r.qty ?? '') !== String(oldRow.qty ?? '') ||
          (r.serialNumber || r.serial_number || '') !== (oldRow.serial_number || oldRow.serialNumber || '')
        );
      });

      if (newlyAddedHwSwRows.length > 0) {
        const summary = newlyAddedHwSwRows.map((row, idx) =>
          `Item ${idx + 1}: [Type: ${row.productType || '-'}, Manufacturer: "${row.manufacturerName || '-'}", Part#: "${row.partNumber || '-'}", QTY: ${row.qty || '-'}, S.N.: ${row.serialNumber || '-'}]`
        ).join(' | ');
        addActivityLog('Created', 'HW/SW POs Item', `${newlyAddedHwSwRows.length} new inline item(s) added — ${summary}`);
      }

      if (deletedHwSwRows.length > 0) {
        const deletedSummary = deletedHwSwRows.map((row, idx) =>
          `Item ${idx + 1}: [Type: ${row.product_type || '-'}, Manufacturer: "${row.manufacturer_name || '-'}", Part#: "${row.part_number || '-'}", QTY: ${row.qty || '-'}, S.N.: ${row.serial_number || '-'}]`
        ).join(' | ');
        addActivityLog('Deleted', 'HW/SW POs Item', `${deletedHwSwRows.length} inline item(s) removed — ${deletedSummary}`);
      }

      // ✅ Modified items log
      if (modifiedHwSwRows.length > 0) {
        const modSummary = modifiedHwSwRows.map((row, idx) => {
          const oldRow = (oldOrder?.items || []).find(old => old.id === row.id);
          const fieldChanges = [];
          if ((row.productType || row.product_type || '') !== (oldRow.product_type || oldRow.productType || ''))
            fieldChanges.push(`Type: "${oldRow.product_type || '-'}" → "${row.productType || '-'}"`);
          if ((row.manufacturerName || row.manufacturer_name || '') !== (oldRow.manufacturer_name || oldRow.manufacturerName || ''))
            fieldChanges.push(`Manufacturer: "${oldRow.manufacturer_name || '-'}" → "${row.manufacturerName || '-'}"`);
          if ((row.partNumber || row.part_number || '') !== (oldRow.part_number || oldRow.partNumber || ''))
            fieldChanges.push(`Part#: "${oldRow.part_number || '-'}" → "${row.partNumber || '-'}"`);
          if (String(row.qty ?? '') !== String(oldRow.qty ?? ''))
            fieldChanges.push(`QTY: "${oldRow.qty ?? '-'}" → "${row.qty ?? '-'}"`);
          if ((row.serialNumber || row.serial_number || '') !== (oldRow.serial_number || oldRow.serialNumber || ''))
            fieldChanges.push(`S.N.: "${oldRow.serial_number || '-'}" → "${row.serialNumber || '-'}"`);
          return `Item ${idx + 1}: [${fieldChanges.join(', ')}]`;
        }).join(' | ');
        addActivityLog('Updated', 'HW/SW POs Item', `${modifiedHwSwRows.length} inline item(s) modified — ${modSummary}`);
      }

      if (changes.length > 0) {
        addActivityLog('Updated', 'HW/SW POs', `HW/SW PO updated — ${changes.join(', ')}`);
      }

      setHardwareSoftwarePosOrderForm({
        orderDate: '', estNo: '', productType: '', userId: '',
        manufacturerName: '', partNumber: '', qty: '', serialNumber: '',
        location: '', poNo: '', shipDate: '', invoiceNo: '', orderStatus: '' , remark: ''
      });
      setHwSwPosItemRows([]);
      fetchHardwareSoftwarePosOrders();
      setEditingHardwareSoftwarePosOrderId(null);
      alert('✅ Hardware & Software PO updated successfully!');
      setActiveOrdersPage('hardware-software-pos-list');

    } else {
      const res = await axios.post('http://localhost:8081/orders/hwswpos', payload);
      const newOrderId = res.data.id;

      addActivityLog(
        'Created', 'HW/SW POs',
        `New HW/SW PO created — Est#: ${hardwareSoftwarePosOrderForm.estNo}, Order Date: ${hardwareSoftwarePosOrderForm.orderDate}, Product: ${hardwareSoftwarePosOrderForm.productType}, Manufacturer: ${hardwareSoftwarePosOrderForm.manufacturerName}, Part#: ${hardwareSoftwarePosOrderForm.partNumber}, QTY: ${hardwareSoftwarePosOrderForm.qty}, S.N.: ${hardwareSoftwarePosOrderForm.serialNumber}, Location: ${hardwareSoftwarePosOrderForm.location}, PO#: ${hardwareSoftwarePosOrderForm.poNo}, Ship Date: ${hardwareSoftwarePosOrderForm.shipDate}, Invoice#: ${hardwareSoftwarePosOrderForm.invoiceNo}, Status: ${hardwareSoftwarePosOrderForm.orderStatus}`
      );

      console.log('🔍 Ref files at save time:', hwSwPodFilesRef.current);
      const podFiles = hwSwPodFilesRef.current.filter(Boolean);
      console.log('🔍 podFiles:', podFiles);

      for (const file of podFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderId', newOrderId);
        try {
          await axios.post('http://localhost:8081/orders/hwswpos/upload-pod', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log('✅ POD uploaded:', file.name);
        } catch (err) {
          console.error('❌ POD upload failed:', err);
        }
      }

      setHardwareSoftwarePosOrderForm({
        orderDate: '', estNo: '', productType: '', userId: '',
        manufacturerName: '', partNumber: '', qty: '', serialNumber: '',
        location: '', poNo: '', shipDate: '', invoiceNo: '', orderStatus: '', remark: ''
      });
      setHwSwPosItemRows([]);
      setHwSwPodFileInputs([{ id: 1, file: null }]);
      hwSwPodFilesRef.current = [];
      fetchHardwareSoftwarePosOrders();
      alert('✅ Hardware & Software PO saved successfully!');
      setActiveOrdersPage('hardware-software-pos-list');
    }
  } catch (error) {
    console.error('❌ Error saving HW/SW POS order:', error);
    alert(`❌ Failed to save: ${error.response?.data?.error || error.message}`);
  }
};

const handleResetHardwareSoftwarePosForm = () => {
  setEditingHardwareSoftwarePosOrderId(null);
  setHwSwPosItemRows([]);
  setHwSwPodFileInputs([{ id: 1, file: null }]);
  hwSwPodFilesRef.current = [{ id: 1, file: null }];
  setHardwareSoftwarePosOrderForm({
    orderDate: '', estNo: '', productType: '', userId: '',
    manufacturerName: '', partNumber: '', qty: '', serialNumber: '',
    location: '', poNo: '', shipDate: '', invoiceNo: '', orderStatus: '' , remark: ''
  });
};

  const handleDeleteHardwareSoftwarePosOrder = async (id) => {
  if (window.confirm("Are you sure you want to delete this Hardware & Software PO?")) {
    try {
      const order = hardwareSoftwarePosOrders.find(o => o.id === id);
      await axios.delete(`http://localhost:8081/orders/hwswpos/${id}`);
      addActivityLog("Deleted", "HW/SW POs", `HW/SW PO deleted — PO#: ${order?.po_no || id}`);
      alert("✅ Hardware & Software PO deleted successfully!");
      fetchHardwareSoftwarePosOrders();
    } catch (error) {
      console.error('❌ Error deleting HW/SW POS order:', error);
      alert(`❌ Failed to delete: ${error.response?.data?.error || error.message}`);
    }
  }
};

  // Filter Hardware & Software POs orders for list view
 const filteredHardwareSoftwarePosOrders = hardwareSoftwarePosOrders.filter(order => {
  const searchLower = hardwareSoftwarePosListSearchTerm.toLowerCase();
  return (
    (order.po_no || '').toLowerCase().includes(searchLower) ||
    (order.invoice_no || '').toLowerCase().includes(searchLower) ||
    (order.order_status || '').toLowerCase().includes(searchLower) ||
    (order.location || '').toLowerCase().includes(searchLower)
  );
});

  const getFilteredHardwareSoftwarePosReportOrders = () => {
  return hardwareSoftwarePosOrders.filter(order => {
    let matches = true;
    if (hardwareSoftwarePosReportFilters.productType && order.product_type !== hardwareSoftwarePosReportFilters.productType) matches = false;
    if (hardwareSoftwarePosReportFilters.manufacturerName && order.manufacturer_name !== hardwareSoftwarePosReportFilters.manufacturerName) matches = false;
    if (hardwareSoftwarePosReportFilters.partNumber && order.part_number !== hardwareSoftwarePosReportFilters.partNumber) matches = false;
    if (hardwareSoftwarePosReportFilters.orderStatus && order.order_status !== hardwareSoftwarePosReportFilters.orderStatus) matches = false;
    if (hardwareSoftwarePosReportFilters.location && order.location !== hardwareSoftwarePosReportFilters.location) matches = false;
    return matches;
  });
};


// Product Management state
const [productForm, setProductForm] = useState({
  productType: '',
  partNumber: '',
  manufacturerName: '',
  productDescription: '',
  extraDetails: '',
  productImage: null
});


  // Get assigned user names
  

    const getOwnerName = (profile) => {
      if (!profile.parent_id) {
        return "Self (Owner)";
      }

      if (profile.parent_name) {
        return profile.parent_name;
      }

      const parentProfile = data.find(p => p.id === profile.parent_id);
      return parentProfile ? parentProfile.name : "Unknown";
    };

   const filteredData = data.filter(profile => {
  const matchesSearch = profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase());

  let matchesViewMode = true;
  if (viewMode === "profiles") {
    matchesViewMode = true;
  } else if (viewMode === "owners") {
    matchesViewMode = !profile.parent_id;
  } else if (viewMode === "all" || viewMode === null) {
    matchesViewMode = true;
  }

  return matchesSearch && matchesViewMode;
}).sort((a, b) => a.id - b.id);


  const stats = {
  total: data.length,
  superadmin: countByRole('superadmin'),
  manager: countByRole('manager'),
  contractor: countByRole('contractor'),
  employee: countByRole('employee'),
  user: countByRole('user'),
  admin: countByRole('admin')
};

// Dynamic - sab roles count karo including custom
const dynamicRoleStats = roles.map(role => ({
  name: role.role_name,
  count: countByRole(role.role_name)
}));

    console.log('📊 Dashboard Stats:', stats);



 // ✅ Sub-components BAHAR define karo - PodFilesSection se pehle

const ExcelPreview = ({ fileUrl }) => {
  const [tableData, setTableData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetch(fileUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setTableData(data);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [fileUrl]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Loading Excel...</div>;
  if (error)   return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444", fontSize: "13px" }}>Could not load preview</div>;
  if (!tableData || tableData.length === 0) return <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Empty file</div>;

  return (
    <div style={{ width: "100%", overflowX: "auto", overflowY: "auto", maxHeight: "320px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", minWidth: "400px" }}>
        <tbody>
          {tableData.map((row, rowIdx) => (
            <tr key={rowIdx} style={{ background: rowIdx === 0 ? "#e8f5e9" : rowIdx % 2 === 0 ? "#f9fafb" : "white" }}>
              {(row.length > 0 ? row : ['']).map((cell, colIdx) => (
                rowIdx === 0 ? (
                  <th key={colIdx} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", color: "#2e7d32", fontWeight: "700", textAlign: "left", whiteSpace: "nowrap", position: "sticky", top: 0, background: "#e8f5e9" }}>
                    {cell ?? ''}
                  </th>
                ) : (
                  <td key={colIdx} style={{ padding: "5px 10px", border: "1px solid #f0f0f0", color: "#374151", whiteSpace: "nowrap" }}>
                    {cell ?? ''}
                  </td>
                )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const WordPreview = ({ fileUrl }) => {
  const [html, setHtml] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetch(fileUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => mammoth.convertToHtml({ arrayBuffer: buffer }))
      .then(result => { setHtml(result.value); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [fileUrl]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Loading Word document...</div>;
  if (error)   return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444", fontSize: "13px" }}>Could not load preview</div>;

  return (
    <div style={{ width: "100%", overflowY: "auto", maxHeight: "320px", padding: "16px", background: "white" }}>
      <div style={{ fontSize: "12px", color: "#374151", lineHeight: "1.6" }}
        dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

const TextPreview = ({ fileUrl }) => {
  const [text, setText] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetch(fileUrl)
      .then(res => res.text())
      .then(data => { setText(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [fileUrl]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>Loading...</div>;
  if (error)   return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444", fontSize: "13px" }}>⚠️ Preview not available</div>;

  return (
    <div style={{ width: "100%", overflowY: "auto", maxHeight: "320px", padding: "16px" }}>
      <pre style={{ fontSize: "11px", color: "#374151", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
        {text}
      </pre>
    </div>
  );
};


const PodFilesSection = ({ order, orderType, setSelectedOrder }) => {
  const uploadUrl  = `http://localhost:8081/orders/${orderType}/${order.id}/pod-files`;
  const refreshUrl = `http://localhost:8081/orders/${orderType}/${order.id}/pod-files`;

  const deleteUrl = (id) => {
    if (orderType === 'avpos')    return `http://localhost:8081/orders/avpos/pod-files/${id}`;
    if (orderType === 'hwswpos')  return `http://localhost:8081/orders/hwswpos/pod-files/${id}`;
    if (orderType === 'hardware') return `http://localhost:8081/orders/hardware/pod-files/${id}`;
    if (orderType === 'itar')     return `http://localhost:8081/orders/itar/pod-files/${id}`;
    return `http://localhost:8081/orders/${orderType}/pod-files/${id}`;
  };

  const acceptFormats = "image/*,.pdf,.xlsx,.xls,.doc,.docx,.txt,.csv";

  // ✅ Ek hi getPreview - saaf aur simple
  const getPreview = (file) => {
    const url  = `http://localhost:8081/uploads/${file.filename}`;
    const name = (file.original_name || file.filename || '').toLowerCase().trim();

    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(name);
    const isPdf   = /\.pdf$/.test(name);
    const isExcel = /\.(xlsx|xls|csv)$/.test(name);
    const isWord  = /\.(doc|docx)$/.test(name);
    const isText  = /\.txt$/.test(name);

    if (isImage) return (
      <img src={url} alt={file.original_name}
        style={{ maxWidth: "100%", borderRadius: "4px", objectFit: "contain", maxHeight: "280px" }} />
    );
    if (isPdf)   return <iframe src={url} title={file.original_name} style={{ width: "100%", height: "320px", border: "none" }} />;
    if (isExcel) return <ExcelPreview fileUrl={url} />;
    if (isWord)  return <WordPreview  fileUrl={url} />;
    if (isText)  return <TextPreview  fileUrl={url} />;

    // Unknown format
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: "48px" }}>📄</div>
        <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px" }}>{name.split('.').pop()?.toUpperCase() || 'File'}</div>
        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>{file.original_name}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px 24px", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
      {/* Header + Upload */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <span style={{ fontSize: "15px", fontWeight: "700", color: "#374151" }}>📎 POD Files</span>
        <label style={{ background: "#1e3a5f", color: "white", padding: "7px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          ⬆️ Upload POD
          <input type="file" accept={acceptFormats} multiple style={{ display: "none" }}
            onChange={async (e) => {
              const files = Array.from(e.target.files);
              for (const file of files) {
                const fd = new FormData();
                fd.append('file', file);
                try {
                  await axios.post(uploadUrl, fd);
                } catch (err) {
                  alert('❌ Upload failed: ' + err.message);
                  return;
                }
              }
              try {
                const podRes = await axios.get(refreshUrl);
                setSelectedOrder(prev => ({ ...prev, pod_files: podRes.data }));
              } catch {}
            }}
          />
        </label>
      </div>

      {/* Cards Grid */}
      {Array.isArray(order.pod_files) && order.pod_files.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {order.pod_files.map((file, fi) => (
            <div key={file.id || fi} style={{ background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
              
              {/* Card Header */}
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
                  POD File {fi + 1}
                </span>
                <button
                  onClick={async () => {
                    if (!window.confirm('Delete this POD file?')) return;
                    try {
                      await axios.delete(deleteUrl(file.id));
                      setSelectedOrder(prev => ({ ...prev, pod_files: prev.pod_files.filter((_, idx) => idx !== fi) }));
                    } catch (err) {
                      alert('❌ Delete failed: ' + err.message);
                    }
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "16px", padding: "2px 6px", borderRadius: "4px" }}
                  title="Delete file">
                  🗑️
                </button>
              </div>

              {/* Preview */}
              <div style={{ flex: 1, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px", overflow: "hidden" }}>
                {getPreview(file)}
              </div>

              {/* Download */}
              <div style={{ padding: "12px 14px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "center", background: "white" }}>
                <a href={`http://localhost:8081/uploads/${file.filename}`}
                  target="_blank" rel="noreferrer" download={file.original_name}
                  style={{ background: "#17a2b8", color: "white", padding: "7px 22px", borderRadius: "5px", fontSize: "12px", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  📥 Download POD File
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "32px 20px", color: "#d1d5db" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>📭</div>
          <div style={{ fontSize: "14px" }}>No POD files uploaded yet</div>
        </div>
      )}
    </div>
  );
};
    return (
      <div style={{ display: "flex", height: "100vh", background: "#f5f5f5" , position: "relative" }}>
        {/* Hamburger Button */}
{isMobile && (
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    style={{
      position: "fixed",
      top: "12px",
      left: sidebarOpen ? "268px" : "12px",
      zIndex: 10001,
      background: "#1a3a52",
      color: "white",
      border: "none",
      borderRadius: "6px",
      width: "40px",
      height: "40px",
      fontSize: "20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "left 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    }}
  >
    {sidebarOpen ? "✕" : "☰"}
  </button>
)}

{/* Overlay */}
{isMobile && sidebarOpen && (
  <div
    onClick={() => setSidebarOpen(false)}
    style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 999,
    }}
  />
)}
        {/* Sidebar */}
        <div style={{
          width: "280px",
          background: "linear-gradient(180deg, #f1f2f8 0%, #72b2f1 100%)",
          position: isMobile ? "fixed" : "relative",
  top: 0, left: 0,
  height: "100vh",
  zIndex: 1000,
  transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
  transition: "transform 0.3s ease",
  overflowY: "auto",
  flexShrink: 0,
          color: "white",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 10px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            padding: "25px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>👑</div>
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
              {user?.name || "Admin"}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              {user?.email || "admin@admin.com"}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            
            {/* ✅ HOME BUTTON - Normal user ke liye */}
{user?.role?.toUpperCase() !== "SUPERADMIN" && (
  <div
    onClick={() => {
      setShowDashboard(false);
      setActiveRolePanel(null);
      setActiveOrdersPage(null);
      setViewMode(null);  
      setShowOrdersDropdown(false);
      setShowManageUsersDropdown(false);
       setShowOrdersSubSection(false);
  setShowITAROrdersSubmenu(false);
  setShowHardwareOrdersSubmenu(false);
  setShowAVPosSubmenu(false);
  setShowHardwareSoftwarePOsSubmenu(false);
    }}
    style={{
      padding: "12px 20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: !activeOrdersPage && !activeRolePanel && !showDashboard ? "#e8f5e9" : "transparent",
      color: !activeOrdersPage && !activeRolePanel && !showDashboard ? "#2e7d32" : "#555",
      fontSize: "14px",
      fontWeight: !activeOrdersPage && !activeRolePanel && !showDashboard ? "600" : "400",
      borderLeft: !activeOrdersPage && !activeRolePanel && !showDashboard ? "4px solid #2e7d32" : "4px solid transparent",
      transition: "0.2s"
    }}
    onMouseEnter={(e) => {
      if (activeOrdersPage || activeRolePanel || showDashboard) {
        e.currentTarget.style.background = "#f0f0f0";
      }
    }}
    onMouseLeave={(e) => {
      if (activeOrdersPage || activeRolePanel || showDashboard) {
        e.currentTarget.style.background = "transparent";
      }
    }}
  >
    🏠 HOME
  </div>
)}
 
{/* ✅ DASHBOARD BUTTON - superadmin ke liye */}
{user?.role?.toUpperCase() === "SUPERADMIN" && (
  <div
    onClick={() => {
      setShowDashboard(true);
      setActiveRolePanel(null);
      setActiveOrdersPage(null);
      setShowOrdersDropdown(false);
      setShowManageUsersDropdown(false);
    }}
    style={{
      padding: "12px 20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: showDashboard ? "#e8f5e9" : "transparent",
      color: showDashboard ? "#2e7d32" : "#555",
      fontSize: "14px",
      fontWeight: showDashboard ? "600" : "400",
      borderLeft: showDashboard ? "4px solid #2e7d32" : "4px solid transparent",
      transition: "0.2s"
    }}
    onMouseEnter={(e) => {
      if (!showDashboard) {
        e.currentTarget.style.background = "#f0f0f0";
      }
    }}
    onMouseLeave={(e) => {
      if (!showDashboard) {
        e.currentTarget.style.background = "transparent";
      }
    }}
  >
    🏠 Dashboard
  </div>
)}

         
{/* ORDER MANAGEMENT - Permission Based */}
{hasAnyPermission([
  'ITAR-Order-Add','ITAR-Order-Edit','ITAR-Order-Delete','ITAR-Order-View',
  'Hardware-orders-Add','Hardware-orders-Edit','Hardware-orders-Delete','Hardware-orders-View',
  'AV-Pos-Add','AV-Pos-Edit','AV-Pos-Delete','AV-Pos-View',
  'Hardware-software-pos-Add','Hardware-software-pos-Edit','Hardware-software-pos-Delete','Hardware-software-pos-View',
  'ITAR-Order','Hardware-orders','AV-Pos','Hardware-software-pos',
  'product-list','product-create','product-edit','product-delete',
  'manufacturer-list','manufacturer-create','manufacturer-edit','manufacturer-delete'
]) && (
<div>
  <div
    onClick={() => {
      setShowOrdersDropdown(!showOrdersDropdown);
      setShowDashboard(false);
      setActiveRolePanel(null);
      setShowManageUsersDropdown(false);
      if (!showOrdersDropdown) {
        setShowOrdersSubSection(true);
      }
    }}
    style={{
      padding: "12px 20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      background: showOrdersDropdown ? "#fff3e0" : "transparent",
      color: showOrdersDropdown ? "#f57c00" : "#555",
      fontSize: "14px",
      fontWeight: showOrdersDropdown ? "600" : "400",
      transition: "0.2s",
      borderLeft: showOrdersDropdown ? "4px solid #f57c00" : "4px solid transparent"
    }}
    onMouseEnter={(e) => { if (!showOrdersDropdown) e.currentTarget.style.background = "#f0f0f0"; }}
    onMouseLeave={(e) => { if (!showOrdersDropdown) e.currentTarget.style.background = "transparent"; }}
  >
    <span>📋 ORDER MANAGEMENT</span>
    <span>{showOrdersDropdown ? "▼" : "▶"}</span>
  </div>

  {showOrdersDropdown && (
    <div style={{ background: "rgba(0,0,0,0.04)" }}>

      {/* Orders submenu - sirf order permissions walo ko */}
      {hasAnyPermission([
        'ITAR-Order-Add','ITAR-Order-Edit','ITAR-Order-Delete','ITAR-Order-View',
        'Hardware-orders-Add','Hardware-orders-Edit','Hardware-orders-Delete','Hardware-orders-View',
        'AV-Pos-Add','AV-Pos-Edit','AV-Pos-Delete','AV-Pos-View',
        'Hardware-software-pos-Add','Hardware-software-pos-Edit','Hardware-software-pos-Delete','Hardware-software-pos-View',
        'ITAR-Order','Hardware-orders','AV-Pos','Hardware-software-pos'
      ]) && (
      <div>
        <div
          onClick={() => {
            setShowITAROrdersSubmenu(false);
            setShowHardwareOrdersSubmenu(false);
            setShowAVPosSubmenu(false);
            setShowHardwareSoftwarePOsSubmenu(false);
            setShowOrdersSubSection(!showOrdersSubSection);
          }}
          style={{
            padding: "10px 20px 10px 32px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            color: showOrdersSubSection ? "#f57c00" : "#444",
            background: showOrdersSubSection ? "#fff3e0" : "rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => { if (!showOrdersSubSection) e.currentTarget.style.background = "#e8e8e8"; }}
          onMouseLeave={(e) => { if (!showOrdersSubSection) e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
        >
          <span>📋 Orders</span>
          <span style={{ fontSize: "10px" }}>{showOrdersSubSection ? "▼" : "▶"}</span>
        </div>

        {showOrdersSubSection && (
          <div style={{ background: "rgba(0,0,0,0.03)" }}>

            {/* ITAR Orders */}
            {hasAnyPermission(['ITAR-Order-Add','ITAR-Order-Edit','ITAR-Order-Delete','ITAR-Order-View','ITAR-Order']) && (
            <div>
              <div
                onClick={() => setShowITAROrdersSubmenu(!showITAROrdersSubmenu)}
                style={{
                  padding: "9px 20px 9px 48px",
                  cursor: "pointer", fontSize: "13px",
                  color: showITAROrdersSubmenu ? "#0066cc" : "#666",
                  background: showITAROrdersSubmenu ? "#e3f2fd" : "transparent",
                  fontWeight: showITAROrdersSubmenu ? "600" : "400",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (!showITAROrdersSubmenu) e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { if (!showITAROrdersSubmenu) e.currentTarget.style.background = "transparent"; }}
              >
                <span>ITAR Orders</span>
                <span style={{ fontSize: "10px" }}>{showITAROrdersSubmenu ? "▼" : "▶"}</span>
              </div>
              {showITAROrdersSubmenu && (
                <div style={{ background: "rgba(0,0,0,0.02)" }}>
                  {hasPermission('ITAR-Order-Add') && (
                    <div
                      onClick={() => {
                        setActiveOrdersPage("itar-create");
                        setShowDashboard(false);
                        setEditingItarOrderId(null);
                        handleResetItarForm();
                      }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "itar-create" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "itar-create" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "itar-create" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "itar-create") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "itar-create") e.currentTarget.style.background = "transparent"; }}
                    >
                      Create
                    </div>
                  )}
                  {hasPermission('ITAR-Order-View') && (
                    <div
                      onClick={() => { setActiveOrdersPage("itar-list"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "itar-list" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "itar-list" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "itar-list" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "itar-list") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "itar-list") e.currentTarget.style.background = "transparent"; }}
                    >
                      List
                    </div>
                  )}
                  {hasPermission('ITAR-Order-View') && (
                    <div
                      onClick={() => { setActiveOrdersPage("itar-report"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "itar-report" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "itar-report" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "itar-report" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "itar-report") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "itar-report") e.currentTarget.style.background = "transparent"; }}
                    >
                      Report
                    </div>
                  )}
                </div>
              )}
            </div>
            )}

            {/* Hardware Orders */}
            {hasAnyPermission(['Hardware-orders-Add','Hardware-orders-Edit','Hardware-orders-Delete','Hardware-orders-View','Hardware-orders']) && (
            <div>
              <div
                onClick={() => setShowHardwareOrdersSubmenu(!showHardwareOrdersSubmenu)}
                style={{
                  padding: "9px 20px 9px 48px",
                  cursor: "pointer", fontSize: "13px",
                  color: showHardwareOrdersSubmenu ? "#0066cc" : "#666",
                  background: showHardwareOrdersSubmenu ? "#e3f2fd" : "transparent",
                  fontWeight: showHardwareOrdersSubmenu ? "600" : "400",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (!showHardwareOrdersSubmenu) e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { if (!showHardwareOrdersSubmenu) e.currentTarget.style.background = "transparent"; }}
              >
                <span>Hardware Orders</span>
                <span style={{ fontSize: "10px" }}>{showHardwareOrdersSubmenu ? "▼" : "▶"}</span>
              </div>
              {showHardwareOrdersSubmenu && (
                <div style={{ background: "rgba(0,0,0,0.02)" }}>
                  {hasPermission('Hardware-orders-Add') && (
                    <div
                      onClick={() => { setActiveOrdersPage("hardware-orders-create"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "hardware-orders-create" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "hardware-orders-create" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "hardware-orders-create" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "hardware-orders-create") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "hardware-orders-create") e.currentTarget.style.background = "transparent"; }}
                    >
                      Create
                    </div>
                  )}
                  {hasPermission('Hardware-orders-View') && (
                    <div
                      onClick={() => { setActiveOrdersPage("hardware-orders-list"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "hardware-orders-list" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "hardware-orders-list" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "hardware-orders-list" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "hardware-orders-list") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "hardware-orders-list") e.currentTarget.style.background = "transparent"; }}
                    >
                      List
                    </div>
                  )}
                  {hasPermission('Hardware-orders-View') && (
                    <div
                      onClick={() => { setActiveOrdersPage("hardware-orders-report"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "hardware-orders-report" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "hardware-orders-report" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "hardware-orders-report" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "hardware-orders-report") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "hardware-orders-report") e.currentTarget.style.background = "transparent"; }}
                    >
                      Report
                    </div>
                  )}
                </div>
              )}
            </div>
            )}

            {/* AV Pos */}
            {hasAnyPermission(['AV-Pos-Add','AV-Pos-Edit','AV-Pos-Delete','AV-Pos-View','AV-Pos']) && (
            <div>
              <div
                onClick={() => setShowAVPosSubmenu(!showAVPosSubmenu)}
                style={{
                  padding: "9px 20px 9px 48px",
                  cursor: "pointer", fontSize: "13px",
                  color: showAVPosSubmenu ? "#0066cc" : "#666",
                  background: showAVPosSubmenu ? "#e3f2fd" : "transparent",
                  fontWeight: showAVPosSubmenu ? "600" : "400",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (!showAVPosSubmenu) e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { if (!showAVPosSubmenu) e.currentTarget.style.background = "transparent"; }}
              >
                <span>AV Pos</span>
                <span style={{ fontSize: "10px" }}>{showAVPosSubmenu ? "▼" : "▶"}</span>
              </div>
              {showAVPosSubmenu && (
                <div style={{ background: "rgba(0,0,0,0.02)" }}>
                  {hasPermission('AV-Pos-Add') && (
                    <div
                      onClick={() => { setActiveOrdersPage("av-pos-create"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "av-pos-create" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "av-pos-create" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "av-pos-create" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "av-pos-create") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "av-pos-create") e.currentTarget.style.background = "transparent"; }}
                    >
                      Create
                    </div>
                  )}
                  {hasPermission('AV-Pos-View') && (
                    <div
                      onClick={() => { setActiveOrdersPage("av-pos-list"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "av-pos-list" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "av-pos-list" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "av-pos-list" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "av-pos-list") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "av-pos-list") e.currentTarget.style.background = "transparent"; }}
                    >
                      List
                    </div>
                  )}
                  {hasPermission('AV-Pos-View') && (
                    <div
                      onClick={() => { setActiveOrdersPage("av-pos-report"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "av-pos-report" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "av-pos-report" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "av-pos-report" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "av-pos-report") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "av-pos-report") e.currentTarget.style.background = "transparent"; }}
                    >
                      Report
                    </div>
                  )}
                </div>
              )}
            </div>
            )}

            {/* Hardware & Software POs */}
            {hasAnyPermission(['Hardware-software-pos-Add','Hardware-software-pos-Edit','Hardware-software-pos-Delete','Hardware-software-pos-View','Hardware-software-pos']) && (
            <div>
              <div
                onClick={() => setShowHardwareSoftwarePOsSubmenu(!showHardwareSoftwarePOsSubmenu)}
                style={{
                  padding: "9px 20px 9px 48px",
                  cursor: "pointer", fontSize: "13px",
                  color: showHardwareSoftwarePOsSubmenu ? "#0066cc" : "#666",
                  background: showHardwareSoftwarePOsSubmenu ? "#e3f2fd" : "transparent",
                  fontWeight: showHardwareSoftwarePOsSubmenu ? "600" : "400",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (!showHardwareSoftwarePOsSubmenu) e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { if (!showHardwareSoftwarePOsSubmenu) e.currentTarget.style.background = "transparent"; }}
              >
                <span>Hardware & Software POs</span>
                <span style={{ fontSize: "10px" }}>{showHardwareSoftwarePOsSubmenu ? "▼" : "▶"}</span>
              </div>
              {showHardwareSoftwarePOsSubmenu && (
                <div style={{ background: "rgba(0,0,0,0.02)" }}>
                  {hasPermission('Hardware-software-pos-Add') && (
                    <div
                      onClick={() => { setActiveOrdersPage("hardware-software-pos-create"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "hardware-software-pos-create" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "hardware-software-pos-create" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "hardware-software-pos-create" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "hardware-software-pos-create") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "hardware-software-pos-create") e.currentTarget.style.background = "transparent"; }}
                    >
                      Create
                    </div>
                  )}
                  {hasPermission('Hardware-software-pos-View') && (
                    <div
                      onClick={() => { setActiveOrdersPage("hardware-software-pos-list"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "hardware-software-pos-list" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "hardware-software-pos-list" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "hardware-software-pos-list" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "hardware-software-pos-list") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "hardware-software-pos-list") e.currentTarget.style.background = "transparent"; }}
                    >
                      List
                    </div>
                  )}
                  {hasPermission('Hardware-software-pos-View') && (
                    <div
                      onClick={() => { setActiveOrdersPage("hardware-software-pos-report"); setShowDashboard(false); }}
                      style={{
                        padding: "8px 20px 8px 68px", cursor: "pointer", fontSize: "12px",
                        color: activeOrdersPage === "hardware-software-pos-report" ? "#0066cc" : "#666",
                        background: activeOrdersPage === "hardware-software-pos-report" ? "#e3f2fd" : "transparent",
                        fontWeight: activeOrdersPage === "hardware-software-pos-report" ? "600" : "400", transition: "0.2s"
                      }}
                      onMouseEnter={(e) => { if (activeOrdersPage !== "hardware-software-pos-report") e.currentTarget.style.background = "#e0e0e0"; }}
                      onMouseLeave={(e) => { if (activeOrdersPage !== "hardware-software-pos-report") e.currentTarget.style.background = "transparent"; }}
                    >
                      Report
                    </div>
                  )}
                </div>
              )}
            </div>
            )}

          </div>
        )}
      </div>
      )}

      {/* Product Management - SUPERADMIN ya permission walo ko */}
      {hasAnyPermission(['product-list','product-create','product-edit','product-delete']) && (
      <div>
        <div
          onClick={() => setShowProductManagementDropdown(!showProductManagementDropdown)}
          style={{
            padding: "10px 20px 10px 32px",
            cursor: "pointer", fontSize: "13px",
            fontWeight: "600",
            color: showProductManagementDropdown ? "#f57c00" : "#444",
            background: showProductManagementDropdown ? "#fff3e0" : "rgba(0,0,0,0.02)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => { if (!showProductManagementDropdown) e.currentTarget.style.background = "#e8e8e8"; }}
          onMouseLeave={(e) => { if (!showProductManagementDropdown) e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
        >
          <span>📦 Product Management</span>
          <span style={{ fontSize: "10px" }}>{showProductManagementDropdown ? "▼" : "▶"}</span>
        </div>
        {showProductManagementDropdown && (
          <div style={{ background: "rgba(0,0,0,0.03)" }}>
            {hasPermission('product-create') && (
              <div
                onClick={() => { setActiveOrdersPage('product-management-create'); setShowDashboard(false); }}
                style={{
                  padding: "9px 20px 9px 52px", cursor: "pointer", fontSize: "12px",
                  color: activeOrdersPage === 'product-management-create' ? "#0066cc" : "#666",
                  background: activeOrdersPage === 'product-management-create' ? "#e3f2fd" : "transparent",
                  fontWeight: activeOrdersPage === 'product-management-create' ? "600" : "400", transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (activeOrdersPage !== 'product-management-create') e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { if (activeOrdersPage !== 'product-management-create') e.currentTarget.style.background = "transparent"; }}
              >
                Create
              </div>
            )}
            {hasPermission('product-list') && (
              <div
                onClick={() => { setActiveOrdersPage('product-management-list'); setShowDashboard(false); }}
                style={{
                  padding: "9px 20px 9px 52px", cursor: "pointer", fontSize: "12px",
                  color: activeOrdersPage === 'product-management-list' ? "#0066cc" : "#666",
                  background: activeOrdersPage === 'product-management-list' ? "#e3f2fd" : "transparent",
                  fontWeight: activeOrdersPage === 'product-management-list' ? "600" : "400", transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (activeOrdersPage !== 'product-management-list') e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { if (activeOrdersPage !== 'product-management-list') e.currentTarget.style.background = "transparent"; }}
              >
                List
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* Manufacturer */}
      {hasAnyPermission(['manufacturer-list','manufacturer-create','manufacturer-edit','manufacturer-delete']) && (
      <div>
        <div
          onClick={() => setShowManufacturerDropdown(!showManufacturerDropdown)}
          style={{
            padding: "10px 20px 10px 32px",
            cursor: "pointer", fontSize: "13px",
            fontWeight: "600",
            color: showManufacturerDropdown ? "#f57c00" : "#444",
            background: showManufacturerDropdown ? "#fff3e0" : "rgba(0,0,0,0.02)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => { if (!showManufacturerDropdown) e.currentTarget.style.background = "#e8e8e8"; }}
          onMouseLeave={(e) => { if (!showManufacturerDropdown) e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
        >
          <span>🏭 Manufacturer</span>
          <span style={{ fontSize: "10px" }}>{showManufacturerDropdown ? "▼" : "▶"}</span>
        </div>
        {showManufacturerDropdown && (
          <div style={{ background: "rgba(0,0,0,0.03)" }}>
            {hasPermission('manufacturer-create') && (
              <div
                onClick={() => { setActiveOrdersPage('manufacturer-create'); setShowDashboard(false); }}
                style={{
                  padding: "9px 20px 9px 52px", cursor: "pointer", fontSize: "12px",
                  color: activeOrdersPage === 'manufacturer-create' ? "#0066cc" : "#666",
                  background: activeOrdersPage === 'manufacturer-create' ? "#e3f2fd" : "transparent",
                  fontWeight: activeOrdersPage === 'manufacturer-create' ? "600" : "400", transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (activeOrdersPage !== 'manufacturer-create') e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { if (activeOrdersPage !== 'manufacturer-create') e.currentTarget.style.background = "transparent"; }}
              >
                Create
              </div>
            )}
            {hasPermission('manufacturer-list') && (
              <div
                onClick={() => { setActiveOrdersPage('manufacturer-list'); setShowDashboard(false); }}
                style={{
                  padding: "9px 20px 9px 52px", cursor: "pointer", fontSize: "12px",
                  color: activeOrdersPage === 'manufacturer-list' ? "#0066cc" : "#666",
                  background: activeOrdersPage === 'manufacturer-list' ? "#e3f2fd" : "transparent",
                  fontWeight: activeOrdersPage === 'manufacturer-list' ? "600" : "400", transition: "0.2s"
                }}
                onMouseEnter={(e) => { if (activeOrdersPage !== 'manufacturer-list') e.currentTarget.style.background = "#e0e0e0"; }}
                onMouseLeave={(e) => { if (activeOrdersPage !== 'manufacturer-list') e.currentTarget.style.background = "transparent"; }}
              >
                List
              </div>
            )}
          </div>
        )}
      </div>
      )}

    </div>
  )}
</div>
)}

 
{/* Manage Users Dropdown */}
{hasAnyPermission(['user-list','user-create','user-edit','user-delete']) && (
  <div>
    <div
      onClick={() => {
        setShowManageUsersDropdown(!showManageUsersDropdown);
        setShowDashboard(false);
        setActiveRolePanel(null);
        setShowOrdersDropdown(false);
      }}
      style={{
        padding: "12px 20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        background: showManageUsersDropdown ? "#e3f2fd" : "transparent",
        color: showManageUsersDropdown ? "#1976d2" : "#555",
        fontSize: "14px",
        fontWeight: showManageUsersDropdown ? "600" : "400",
        transition: "0.2s",
        borderLeft: showManageUsersDropdown ? "4px solid #1976d2" : "4px solid transparent"
      }}
      onMouseEnter={(e) => {
        if (!showManageUsersDropdown) e.currentTarget.style.background = "#f0f0f0";
      }}
      onMouseLeave={(e) => {
        if (!showManageUsersDropdown) e.currentTarget.style.background = "transparent";
      }}
    >
      <span>👥 MANAGE USERS</span>
      <span>{showManageUsersDropdown ? "▼" : "▶"}</span>
    </div>

    {showManageUsersDropdown && (
      <div style={{ background: "rgba(0,0,0,0.05)" }}>

        {/* Add New User - sirf user-create permission */}
        {hasPermission('user-create') && (
        <div
          onClick={() => {
            handleOpenAddModal();
            setShowManageUsersDropdown(false);
          }}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#5cb85c",
            background: "transparent",
            fontWeight: "600",
            transition: "0.2s",
            borderBottom: "1px solid #e0e0e0"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#e8f5e9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          ➕ Add New User
        </div>
        )}

        {/* All Profiles - sirf user-list permission */}
        {hasPermission('user-list') && (
        <div
          onClick={() => {
            setViewMode("profiles");
            setShowDashboard(false);
            setActiveOrdersPage(null);    
            setActiveRolePanel(null); 
          }}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "13px",
            color: viewMode === "profiles" ? "#1976d2" : "#666",
            background: viewMode === "profiles" ? "#e3f2fd" : "transparent",
            fontWeight: viewMode === "profiles" ? "600" : "400",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => {
            if (viewMode !== "profiles") e.currentTarget.style.background = "#e0e0e0";
          }}
          onMouseLeave={(e) => {
            if (viewMode !== "profiles") e.currentTarget.style.background = "transparent";
          }}
        >
          📋 All Profiles
        </div>
        )}

        {/* All Owners - sirf user-list permission */}
        {hasPermission('user-list') && (
        <div
          onClick={() => {
            setViewMode("owners");
            setShowDashboard(false);
            setActiveOrdersPage(null);    
            setActiveRolePanel(null);  
          }}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "13px",
            color: viewMode === "owners" ? "#1976d2" : "#666",
            background: viewMode === "owners" ? "#e3f2fd" : "transparent",
            fontWeight: viewMode === "owners" ? "600" : "400",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => {
            if (viewMode !== "owners") e.currentTarget.style.background = "#e0e0e0";
          }}
          onMouseLeave={(e) => {
            if (viewMode !== "owners") e.currentTarget.style.background = "transparent";
          }}
        >
          👑 All Owners
        </div>
        )}

      </div>
    )}
  </div>
)}

            {/* Roles Management */}
{hasAnyPermission(['role-list','role-create','role-edit','role-delete']) && (
  <div>
    <div
      onClick={() => {
        setShowRoleManagementDropdown(!showRoleManagementDropdown);
        setShowDashboard(false);
        setShowManageUsersDropdown(false);
        setShowOrdersDropdown(false);
        setShowProductManagementDropdown(false);
        setShowManufacturerDropdown(false);
      }}
      style={{
        padding: "12px 20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        background: showRoleManagementDropdown ? "#fff3e0" : "transparent",
        color: showRoleManagementDropdown ? "#f57c00" : "#555",
        fontSize: "14px",
        fontWeight: showRoleManagementDropdown ? "600" : "400",
        transition: "0.2s",
        borderLeft: showRoleManagementDropdown ? "4px solid #f57c00" : "4px solid transparent"
      }}
      onMouseEnter={(e) => {
        if (!showRoleManagementDropdown) e.currentTarget.style.background = "#f0f0f0";
      }}
      onMouseLeave={(e) => {
        if (!showRoleManagementDropdown) e.currentTarget.style.background = "transparent";
      }}
    >
      <span>🎭 ROLES MANAGEMENT</span>
      <span>{showRoleManagementDropdown ? "▼" : "▶"}</span>
    </div>

    {showRoleManagementDropdown && (
      <div style={{ background: "rgba(0,0,0,0.05)" }}>

        {/* Role List - sirf role-list permission */}
        {hasPermission('role-list') && (
        <div
          onClick={() => {
            setActiveRolePanel("list");
            setShowDashboard(false);
            setShowRoleManagementDropdown(false);
          }}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "13px",
            color: activeRolePanel === "list" ? "#1976d2" : "#666",
            background: activeRolePanel === "list" ? "#e3f2fd" : "transparent",
            fontWeight: activeRolePanel === "list" ? "600" : "400",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => {
            if (activeRolePanel !== "list") e.currentTarget.style.background = "#e0e0e0";
          }}
          onMouseLeave={(e) => {
            if (activeRolePanel !== "list") e.currentTarget.style.background = "transparent";
          }}
        >
          📋 Role List
        </div>
        )}

        {/* Add Role - sirf role-create permission */}
        {hasPermission('role-create') && (
        <div
          onClick={() => {
            setActiveRolePanel("add");
            setShowDashboard(false);
            setShowRoleManagementDropdown(false);
          }}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "13px",
            color: activeRolePanel === "add" ? "#5cb85c" : "#666",
            background: activeRolePanel === "add" ? "#e8f5e9" : "transparent",
            fontWeight: activeRolePanel === "add" ? "600" : "400",
            transition: "0.2s",
            borderBottom: "1px solid #e0e0e0"
          }}
          onMouseEnter={(e) => {
            if (activeRolePanel !== "add") e.currentTarget.style.background = "#e0e0e0";
          }}
          onMouseLeave={(e) => {
            if (activeRolePanel !== "add") e.currentTarget.style.background = "transparent";
          }}
        >
          ➕ Add Role
        </div>
        )}

      </div>
    )}
  </div>
)}

            {/* Activity Logs */}
<div
  onClick={() => {
    setActiveOrdersPage('activity-logs');
    setShowDashboard(false);
    setActiveRolePanel(null);
    setShowOrdersDropdown(false);
    setShowManageUsersDropdown(false);
  }}
  style={{
    padding: "12px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: activeOrdersPage === 'activity-logs' ? "#e3f2fd" : "transparent",
    color: activeOrdersPage === 'activity-logs' ? "#1976d2" : "#555",
    fontSize: "14px",
    fontWeight: activeOrdersPage === 'activity-logs' ? "600" : "400",
    borderLeft: activeOrdersPage === 'activity-logs' ? "4px solid #1976d2" : "4px solid transparent",
    transition: "0.2s"
  }}
  onMouseEnter={(e) => { if (activeOrdersPage !== 'activity-logs') e.currentTarget.style.background = "#f0f0f0"; }}
  onMouseLeave={(e) => { if (activeOrdersPage !== 'activity-logs') e.currentTarget.style.background = "transparent"; }}
>
  🕵️ USER ACTIVITY
</div>
           
          </div>

          <div style={{ padding: "15px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "8px" }}>Site</div>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "10px",
                background: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              🚪 LOGOUT
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Center Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
            {/* DASHBOARD VIEW */}
            {showDashboard && !activeOrdersPage && user?.role?.toUpperCase() === "SUPERADMIN" && (
              <div>
                <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>Dashboard Overview</h1>

                {/* Stats Cards Grid */}
                <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "30px"
}}>
  {/* Total Users - hamesha dikhega */}
  <div style={{
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderTop: "4px solid #2c3e50"
  }}>
    <div style={{ color: "#666", fontSize: "12px", marginBottom: "8px" }}>TOTAL USERS</div>
    <div style={{ fontSize: "32px", fontWeight: "700", color: "#2c3e50" }}>{stats.total}</div>
    <div style={{ color: "#27ae60", fontSize: "12px", marginTop: "8px" }}>↑ {stats.total}</div>
  </div>

  {/* Dynamic - har role ka card */}
  {dynamicRoleStats.map((roleStat, idx) => {
    const colors = [
      "#e91e63", "#2196f3", "#00bcd4", "#9c27b0",
      "#f57c00", "#60b027", "#e74c3c", "#1abc9c",
      "#3498db", "#8e44ad", "#e67e22", "#27ae60"
    ];
    const color = colors[idx % colors.length];

    return (
      <div key={roleStat.name} style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderTop: `4px solid ${color}`
      }}>
        <div style={{ color: "#666", fontSize: "12px", marginBottom: "8px" }}>
          {roleStat.name.toUpperCase()}
        </div>
        <div style={{ fontSize: "32px", fontWeight: "700", color: color }}>
          {roleStat.count}
        </div>
        <div style={{ color: "#27ae60", fontSize: "12px", marginTop: "8px" }}>
          ↑ {roleStat.count}
        </div>
      </div>
    );
  })}
</div>

                {/* Role Distribution Chart */}
                <div style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                  <h3 style={{ marginBottom: "20px", color: "#2c3e50" }}>ROLE OVERVIEW</h3>
               {dynamicRoleStats.map((roleStat, idx) => {
  const percentage = data.length > 0
    ? (roleStat.count / data.length * 100).toFixed(1)
    : 0;
  const colors = [
    "#e91e63", "#2196f3", "#00bcd4", "#9c27b0",
    "#f57c00", "#60b027", "#e74c3c", "#1abc9c",
    "#3498db", "#8e44ad", "#e67e22", "#27ae60"
  ];
  const color = colors[idx % colors.length];

  return (
    <div key={roleStat.name} style={{ marginBottom: "15px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px",
        fontSize: "14px"
      }}>
        <span style={{ textTransform: "uppercase", fontWeight: "600" }}>
          {roleStat.name}
        </span>
        <span>{roleStat.count} ({percentage}%)</span>
      </div>
      <div style={{
        background: "#f0f0f0",
        borderRadius: "10px",
        height: "10px",
        overflow: "hidden"
      }}>
        <div style={{
          background: color,
          width: `${percentage}%`,
          height: "100%",
          transition: "width 0.3s"
        }} />
      </div>
    </div>
  );
})}
                </div>
              </div>
            )}

           

          {activeOrdersPage === "itar-create" && (
  <div>
    <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>
      {editingItarOrderId ? 'ITAR Orders - Edit' : 'ITAR Orders - Create'}
    </h1>

    <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>

      {/* Order Date + Est # */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Date /y</label>
          <input type="date" value={itarOrderForm.orderDate}
            onChange={(e) => setItarOrderForm({...itarOrderForm, orderDate: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Est #</label>
          <input type="text" value={itarOrderForm.estNo}
            onChange={(e) => setItarOrderForm({...itarOrderForm, estNo: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      </div>

      {/* Product Type + User + Manufacturer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Product Type</label>
          <select value={itarOrderForm.productType}
            onChange={(e) => setItarOrderForm({
              ...itarOrderForm,
              productType: e.target.value,
              partNumber: '',
              manufacturerName: '',
              specialRequest: ''
            })}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
            <option value="">Select Product Type</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="services">Services</option>
          </select>
        </div>

        

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Manufacturer Name</label>
          <select
  value={itarOrderForm.manufacturerName}
  onChange={(e) => setItarOrderForm({
    ...itarOrderForm,
    manufacturerName: e.target.value,
    partNumber: '',
    specialRequest: ''
  })}
  style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
  title=""
>
  <option value="">Select Manufacturer Name</option>
  {/* ✅ Sab manufacturers dikhao - koi filter nahi */}
  {manufacturers.map((m) => (
    <option key={m.id} value={m.name}>{m.name}</option>
  ))}
</select>
        </div>
      </div>

      {(() => {
        const isOther    = itarOrderForm.manufacturerName?.toLowerCase() === 'other';
        const isServices = itarOrderForm.productType === 'services';

        return (
          <>
            {/* Part Number + QTY + S.N. — single row */}
<div style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "flex-end" }}>

  {/* Part Number */}
  {!isOther && (
    <div style={{ width: "450px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>
        Select Part Number
      </label>
      <select
        value={itarOrderForm.partNumber}
        onChange={(e) => setItarOrderForm({...itarOrderForm, partNumber: e.target.value})}
        disabled={!itarOrderForm.productType}
        style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
        <option value="">
          {!itarOrderForm.productType ? "Select Product Type first" : "Select Part Number"}
        </option>
        {getItarPartByType(itarOrderForm.productType, itarOrderForm.manufacturerName)
          .map((partNum, i) => (
            <option key={i} value={partNum}>{partNum}</option>
          ))
        }
      </select>
    </div>
  )}

  {/* QTY */}
  {!isServices && (
    <div style={{ width: "200px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>QTY #</label>
      <input type="number" value={itarOrderForm.qty}
        onChange={(e) => setItarOrderForm({...itarOrderForm, qty: e.target.value})}
        style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
    </div>
  )}

  {/* S.N. */}
  {!isOther && (
    <div style={{ width: "260px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>S.N. #</label>
      <input type="text" value={itarOrderForm.serialNumber}
        onChange={(e) => setItarOrderForm({...itarOrderForm, serialNumber: e.target.value})}
        style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
    </div>
  )}

</div>

            {/* Special Request - only when other */}
            {isOther && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Special Request</label>
                <input type="text" value={itarOrderForm.specialRequest || ''}
                  onChange={(e) => setItarOrderForm({...itarOrderForm, specialRequest: e.target.value})}
                  placeholder="Enter special request..."
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
              </div>
            )}
  
          </>
        );
      })()}

      {/* Inline Item Rows */}
      <div style={{ marginBottom: "28px" }}>
        {itarItemRows.map((row, idx) => {
          const isOther    = row.manufacturerName?.toLowerCase() === 'other';
          const isServices = row.productType === 'services';

          return (
            <div key={row.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>

              {/* Product Type */}
              <div style={{ position: "relative", flex: 1.2, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
                  {idx === 0 ? "Select Product Type" : "Type Of Product"}
                </span>
                <select value={row.productType}
                  onChange={e => {
                    updateItarRow(row.id, "productType", e.target.value);
                    updateItarRow(row.id, "manufacturerName", "");
                    updateItarRow(row.id, "partNumber", "");
                    updateItarRow(row.id, "specialRequest", "");
                  }}
                  style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
                  <option value=""></option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="services">Services</option>
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
              </div>

              {/* Manufacturer Name */}
              <div style={{ position: "relative", flex: 1.2, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
                  {idx === 0 ? "Select Manufacturer Name" : "Manufacturer Name"}
                </span>
                <select value={row.manufacturerName}
                  onChange={e => {
                    updateItarRow(row.id, "manufacturerName", e.target.value);
                    updateItarRow(row.id, "partNumber", "");
                    updateItarRow(row.id, "specialRequest", "");
                  }}
                  style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
                  <option value="">Select Manufacturer Name</option>
                  {/* ✅ Row ke product type ke hisaab se manufacturers filter */}
                  {manufacturers
  .filter(m =>
    m.name?.toLowerCase() === 'other' ||   
    !row.productType ||
    products.some(p =>
      p.manufacturer_name?.toLowerCase() === m.name?.toLowerCase() &&
      p.product_type?.toLowerCase() === row.productType?.toLowerCase()
    )
  )
  .map((m) => (
    <option key={m.id} value={m.name}>{m.name}</option>
  ))
}
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
              </div>

              {/* Part Number */}
              {!isOther && (
                <div style={{ position: "relative", flex: 1.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                  <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
                    {idx === 0 ? "Select Part Number" : "Part Number"}
                  </span>
                  {/* ✅ getFilteredPartNumbers use karo — PART_NUMBER_OPTIONS nahi */}
                  <select value={row.partNumber}
                    onChange={e => updateItarRow(row.id, "partNumber", e.target.value)}
                    disabled={!row.productType}
                    style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
                    <option value=""></option>
                    {getItarPartByType(row.productType, row.manufacturerName)
  .map((partNum, i) => (
    <option key={i} value={partNum}>{partNum}</option>
  ))
}
                  </select>
                  <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
                </div>
              )}

              {/* Special Request */}
              {isOther && (
                <div style={{ position: "relative", flex: 1.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                  <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
                    Special Request
                  </span>
                  <input type="text" value={row.specialRequest || ''}
                    onChange={e => updateItarRow(row.id, "specialRequest", e.target.value)}
                    placeholder="Enter special request..."
                    style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
                </div>
              )}

              {/* QTY */}
              {!isServices && (
                <div style={{ position: "relative", flex: 0.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                  <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", zIndex: 1 }}>
                    {idx === 0 ? "QTY #" : "QTY#"}
                  </span>
                  <input type="number" min="1" value={row.qty}
                    onChange={e => updateItarRow(row.id, "qty", e.target.value)}
                    style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
                </div>
              )}

              {/* S.N. */}
              {!isOther && (
                <div style={{ position: "relative", flex: 0.7, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                  <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", zIndex: 1 }}>
                    {idx === 0 ? "S.N. #" : "S.N.#"}
                  </span>
                  <input type="text" value={row.serialNumber}
                    onChange={e => updateItarRow(row.id, "serialNumber", e.target.value)}
                    style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
                </div>
              )}

              {/* Remove Button */}
              <button onClick={() => removeItarRow(row.id)}
                style={{ width: "34px", height: "34px", flexShrink: 0, borderRadius: "50%", background: "#1a2a4a", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✕
              </button>
            </div>
          );
        })}

        {/* Add Row Button */}
        <button onClick={addItarRow}
          style={{ width: "38px", height: "38px", flexShrink: 0, borderRadius: "50%", background: "#4a5568", color: "#fff", border: "none", cursor: "pointer", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
          ＋
        </button>
      </div>

      {/* Location + ITAR # */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Location</label>
          <input type="text" value={itarOrderForm.location}
            onChange={(e) => setItarOrderForm({...itarOrderForm, location: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>ITAR #</label>
          <input type="text" value={itarOrderForm.itarNo}
            onChange={(e) => setItarOrderForm({...itarOrderForm, itarNo: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      </div>

        {/* ── POD FILE UPLOAD — sirf edit mode mein ── */}
{editingItarOrderId && (
  <div style={{ marginBottom: "20px", padding: "20px", background: "#f8f6ff",
    borderRadius: "10px", border: "1px solid #ede9fe" }}>
    <label style={{ display: "block", marginBottom: "12px", fontWeight: "700",
      fontSize: "13px", color: "#5b21b6" }}>
      📎 POD File
    </label>

    {/* ── Existing uploaded files ── */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
      {Array.isArray(itarPodFiles) && itarPodFiles.length > 0 ? (
        itarPodFiles.map((file, fi) => (
          <div key={file.id || fi} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <a href={`http://localhost:8081/uploads/${file.filename}`}
              target="_blank" rel="noreferrer" download={file.original_name}
              style={{ background: "linear-gradient(135deg,#1e3a5f,#2d5a9e)", color: "white",
                padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              📥 {file.original_name || `POD File ${fi + 1}`}
            </a>
            <button onClick={async () => {
                if (!window.confirm('Delete this POD file?')) return;
                await axios.delete(`http://localhost:8081/orders/itar/pod-files/${file.id}`);
                setItarPodFiles(prev => prev.filter((_,i) => i !== fi));
              }}
              style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
                padding: "8px 10px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
              🗑️
            </button>
          </div>
        ))
      ) : (
        <span style={{ fontSize: "13px", color: "#9ca3af" }}>No files uploaded yet</span>
      )}
    </div>

    {/* ── New file inputs ── */}
    <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600",
      marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      Add New Files:
    </div>
    {itarFileInputs.map((fileInput, index) => (
      <div key={fileInput.id} style={{ display: "flex", gap: "10px", alignItems: "center",
        marginBottom: index < itarFileInputs.length - 1 ? "10px" : "0" }}>
        <input type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setItarSelectedFiles(prev => {
              const filtered = prev.filter(f => f.inputId !== fileInput.id);
              return [...filtered, { inputId: fileInput.id, file }];
            });
          }}
          style={{ flex: 1, padding: "8px", border: "1px solid #ddd",
            borderRadius: "4px", fontSize: "14px", background: "white" }}
        />
        {index === 0 ? (
          <button type="button" onClick={handleAddItarFile}
            style={{ padding: "8px 24px", background: "#7c3aed", color: "white",
              border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
            Add
          </button>
        ) : (
          <button type="button" onClick={() => {
              handleRemoveItarFile(fileInput.id);
              setItarSelectedFiles(prev => prev.filter(f => f.inputId !== fileInput.id));
            }}
            style={{ padding: "8px 18px", background: "#ef4444", color: "white",
              border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
            X
          </button>
        )}
      </div>
    ))}
  </div>
)}

      {/* Ship Date + Invoice # */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Ship Date /y</label>
          <input type="date" value={itarOrderForm.shipDate}
            onChange={(e) => setItarOrderForm({...itarOrderForm, shipDate: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Invoice #</label>
          <input type="text" value={itarOrderForm.invoiceNo}
            onChange={(e) => setItarOrderForm({...itarOrderForm, invoiceNo: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      </div>

      {/* Order Status */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Status #</label>
        <select value={itarOrderForm.orderStatus}
          onChange={(e) => setItarOrderForm({...itarOrderForm, orderStatus: e.target.value})}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
          <option value="">Select a order status</option>
          <option value="Backorder">Backorder</option>
          <option value="Open">Open</option>
          <option value="Completed">Completed</option>
          <option value="Voided">Voided</option>
        </select>
      </div>

       {/* Remark / Comment */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Remark / Comment</label>
        <textarea
          value={itarOrderForm.remark || ''}
          onChange={(e) => setItarOrderForm({...itarOrderForm, remark: e.target.value})}
          placeholder="Enter remark or comment..."
          rows={4}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>
      

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={handleResetItarForm}
          style={{ background: "#6c757d", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
          Reset
        </button>
        <button onClick={handleSaveItarOrder}
          style={{ background: "#5cb85c", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
          💾 {editingItarOrderId ? 'Update Order' : 'Save Order'}
        </button>
      
      </div>

    </div>
  </div>
)}

          {activeOrdersPage === "itar-list" && (
  <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
    <style>{`
      @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.6} }
      .order-row { transition: all 0.18s ease; cursor: default; }
      .order-row:hover { background: linear-gradient(90deg, #eff6ff 0%, #f8faff 100%) !important; transform: translateX(2px); box-shadow: -3px 0 0 #3b82f6; }
      .itar-row:hover { box-shadow: -3px 0 0 #8b5cf6 !important; background: linear-gradient(90deg, #f5f3ff 0%, #faf8ff 100%) !important; }
      .action-btn { transition: all 0.15s ease; border: none; cursor: pointer; }
      .edit-btn:hover { background: #3b82f6 !important; color: white !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,130,246,0.4) !important; }
      .del-btn:hover { background: #ef4444 !important; color: white !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239,68,68,0.4) !important; }
      .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
      .search-input:focus { outline: none; border-color: #8b5cf6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.1) !important; }
    `}</style>

    {/* Page Header */}
    <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "32px 32px 80px", position: "relative", overflow: "hidden", animation: "fadeSlideIn 0.4s ease" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em", backdropFilter: "blur(10px)" }}>ORDERS MANAGEMENT</span>
            </div>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>ITAR Orders</h1>
            <p style={{ margin: "6px 0 0", fontSize: "15px", color: "rgba(255,255,255,0.75)" }}>Track and manage all ITAR compliance orders</p>
          </div>
          {hasPermission('ITAR-Order-Add') && (
  <button onClick={() => {
    setEditingItarOrderId(null);
    setItarOrderForm({ orderDate:'',estNo:'',productType:'',manufacturerName:'',partNumber:'',specialRequest:'',qty:'',serialNumber:'',location:'',itarNo:'',shipDate:'',invoiceNo:'',orderStatus:'',username:'',remark:'' });
    setActiveOrdersPage('itar-create');
  }}
    style={{ background: "white", color: "#764ba2", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", transition: "transform 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
    <span style={{ fontSize: "18px" }}>+</span> New ITAR Order
  </button>
)}
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <div style={{ padding: "0 32px", marginTop: "-44px", position: "relative", zIndex: 10, animation: "fadeSlideIn 0.5s ease 0.1s both" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {[
          { label: "Total Orders", value: itarOrders.length, icon: "📋", color: "#764ba2", light: "#f5f3ff" },
          { label: "Open", value: itarOrders.filter(o => o.order_status === 'Open').length, icon: "🔓", color: "#f59e0b", light: "#fffbeb" },
          { label: "Completed", value: itarOrders.filter(o => o.order_status === 'Completed').length, icon: "✅", color: "#10b981", light: "#ecfdf5" },
          { label: "Backorder", value: itarOrders.filter(o => o.order_status === 'Backorder').length, icon: "⏳", color: "#ef4444", light: "#fef2f2" },
          { label: "Voided", value: itarOrders.filter(o => o.order_status === 'Voided').length, icon: "📪", color: "#6b7280", light: "#f9fafb" },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ background: "white", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: stat.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: "30px", fontWeight: "800", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px", fontWeight: "500" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Main Table */}
    <div style={{ padding: "24px 32px 32px", animation: "fadeSlideIn 0.5s ease 0.2s both" }}>
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Show</span>
            <select value={entriesPerPage} onChange={(e) => {setEntriesPerPage(Number(e.target.value)); setItarCurrentPage(1); }}
              style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "white", fontWeight: "500" }}>
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
            </select>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>entries</span>
            <span style={{ marginLeft: "8px", background: "#ede9fe", color: "#7c3aed", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{filteredItarOrders.length} records</span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔍</span>
            <input className="search-input" type="text" placeholder="Search ITAR orders..." value={listSearchTerm} onChange={(e) => setListSearchTerm(e.target.value)}
              style={{ padding: "9px 14px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "13px", width: "240px", color: "#374151", transition: "all 0.2s" }} />
          </div>
        </div>

        {filteredItarOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px", animation: "shimmer 2s infinite" }}>📭</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>No ITAR Orders Yet</div>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "6px" }}>Click "New ITAR Order" to create your first order</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1500px" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                    {["#","ITAR No#", "Order Date", "Est #",  "Product Type", "Manufacturer", "SPLIT", "QTY", "Serial No#", "Location", "Ship Date", "Invoice No#",  "Status", "Actions"].map((h, i) => (
  <th key={i} style={{ padding: "13px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
    {h === "SPLIT" ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "700", border: "1px solid #bfdbfe", display: "inline-block" }}>
          # Part No
        </span>
        <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "700", border: "1px solid #fcd34d", display: "inline-block" }}>
          ✦ Special Request
        </span>
      </div>
    ) : h}
  </th>
))}
                  </tr>
                </thead>
                <tbody>
                  {filteredItarOrders.slice(
  (itarCurrentPage - 1) * entriesPerPage,
  itarCurrentPage * entriesPerPage
).map((order, idx) => {

                    // ── Same logic as create form ──
                    const isOther    = order.manufacturer_name?.toLowerCase() === 'other';
                    const isServices = order.product_type?.toLowerCase() === 'services';

                 //   const name = order.assigned_user_name || order.username || order.assigned_username || '';
                 //   const avatarPalette = ['#8b5cf6','#3b82f6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899'];
                    const statusConfig = {
                      'Completed': { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7', dot: '#10b981' },
                      'Open':      { bg: '#fffbeb', color: '#92400e', border: '#fcd34d', dot: '#f59e0b' },
                      'Backorder': { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5', dot: '#ef4444' },
                      'Voided':    { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb', dot: '#9ca3af' },
                    };
                    const sc = statusConfig[order.order_status] || statusConfig['Voided'];

                    return (
                      <React.Fragment key={order.id}>
                        <tr className="order-row itar-row" style={{ borderBottom: "1px solid #f9fafb" }}>

                          {/* # */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#d1d5db", fontWeight: "600" }}>{String(idx+1).padStart(2,'0')}</td>

                         {/* ITAR No# - clickable */}
<td style={{ padding: "14px 16px" }}>
  <span
    onClick={async () => {
  setSelectedItarOrder(order);
  try {
    const podRes = await axios.get(`http://localhost:8081/orders/itar/${order.id}/pod-files`);
    setSelectedItarOrder({ ...order, pod_files: podRes.data });
  } catch (e) {
    setSelectedItarOrder({ ...order, pod_files: [] });
  }
  setActiveOrdersPage('itar-detail');
}}
    style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#5b21b6", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.02em", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
    {order.itar_no || '—'}
  </span>
</td>
                          {/* Order Date */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(order.order_date) || <span style={{color:"#e5e7eb"}}>—</span>}</td>

                          {/* Est # */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{order.est_no || <span style={{color:"#e5e7eb"}}>—</span>}</td>

                          
                          

                          {/* Product Type */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151", textTransform: "capitalize" }}>{order.product_type || <span style={{color:"#e5e7eb"}}>—</span>}</td>

                          {/* Manufacturer */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.manufacturer_name || <span style={{color:"#e5e7eb"}}>—</span>}</td>

                          {/* Part No# OR Special Request */}
                          <td style={{ padding: "14px 16px", fontSize: "13px" }}>
                            {isOther ? (
                              // Show Special Request
                              order.special_request ? (
                                <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #fcd34d" }}>
                                  ✦ {order.special_request}
                                </span>
                              ) : <span style={{color:"#e5e7eb"}}>—</span>
                            ) : (
                              // Show Part Number
                              order.part_number
                                ? <span style={{ color: "#374151", fontFamily: "monospace" }}>{order.part_number}</span>
                                : <span style={{color:"#e5e7eb"}}>—</span>
                            )}
                          </td>

                          {/* QTY - blank/dash when services */}
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            {!isServices && order.qty ? (
                              <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{order.qty}</span>
                            ) : <span style={{color:"#e5e7eb"}}>—</span>}
                          </td>

                          {/* Serial No# - blank/dash when other */}
                          <td style={{ padding: "14px 16px", fontSize: "12px", color: "#374151", fontFamily: "monospace" }}>
                            {!isOther && order.serial_number
                              ? order.serial_number
                              : <span style={{color:"#e5e7eb", fontFamily:"sans-serif"}}>—</span>}
                          </td>

                          {/* Location */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.location || <span style={{color:"#e5e7eb"}}>—</span>}</td>

                          {/* Ship Date */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(order.ship_date) || <span style={{color:"#e5e7eb"}}>—</span>}</td>

                          {/* Invoice No# */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.invoice_no || <span style={{color:"#e5e7eb"}}>—</span>}</td>

                          

                          {/* Status */}
                          <td style={{ padding: "14px 16px" }}>
                            {order.order_status ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block", flexShrink: 0 }} />
                                {order.order_status}
                              </span>
                            ) : <span style={{color:"#e5e7eb"}}>—</span>}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            {Array.isArray(order.items) && order.items.length > 0 && (
                              <button
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                style={{ background: expandedOrderId === order.id ? "#ede9fe" : "#f5f3ff", color: "#5b21b6", border: "1px solid #ddd6fe", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginRight: "6px" }}>
                                {expandedOrderId === order.id ? "▲" : "▼"} {order.items.length}
                              </button>
                            )}
                           {hasPermission('ITAR-Order-Edit') && (
<button className="action-btn edit-btn" onClick={async () => {
  await fetchManufacturers();
  setItarOrderForm({
    orderDate: order.order_date ? order.order_date.toString().split('T')[0] : '',
    estNo: order.est_no || '',
    productType: order.product_type || '',
    manufacturerName: order.manufacturer_name || '',
    partNumber: order.part_number || '',
    specialRequest: order.special_request || '',
    qty: order.qty || '',
    serialNumber: order.serial_number || '',
    location: order.location || '',
    itarNo: order.itar_no || '',
    shipDate: order.ship_date ? order.ship_date.toString().split('T')[0] : '',
    invoiceNo: order.invoice_no || '',
    orderStatus: order.order_status || '',
    username: order.username || order.assigned_username || '',
    remark: order.remark || order.comment || ''
  });
  setItarItemRows(Array.isArray(order.items) && order.items.length > 0
    ? order.items.map(item => ({
        id: item.id || Date.now() + Math.random(),
        productType: item.productType || item.product_type || '',
        manufacturerName: item.manufacturerName || item.manufacturer_name || '',
        partNumber: item.partNumber || item.part_number || '',
        specialRequest: item.specialRequest || item.special_request || '',
        qty: item.qty || '',
        serialNumber: item.serialNumber || item.serial_number || '',
      }))
    : []);
  setEditingItarOrderId(order.id);
  setItarPodFiles([]);
  try {
    const podRes = await axios.get(`http://localhost:8081/orders/itar/${order.id}/pod-files`);
    setItarPodFiles(podRes.data);
  } catch (e) {
    console.log('No pod files');
  }
  setActiveOrdersPage('itar-create');
}}
  style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", marginRight: "6px" }}>
  ✏️ Edit
</button>
)}

{hasPermission('ITAR-Order-Delete') && (
<button className="action-btn del-btn" onClick={() => handleDeleteItarOrder(order.id)}
  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
  🗑️
</button>
)}
                          </td>
                        </tr>

                        {/* ── Expanded Items Sub-Table ── */}
                        {expandedOrderId === order.id && Array.isArray(order.items) && order.items.length > 0 && (
                          <tr>
                            <td colSpan={14} style={{ padding: 0, background: "#f8f6ff" }}>
                              <div style={{ padding: "14px 24px 18px 48px", borderBottom: "2px solid #ede9fe", borderTop: "1px solid #ede9fe" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#5b21b6", letterSpacing: "0.05em" }}>📦 ITEM ROWS</span>
                                  <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{order.items.length} items</span>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                  <thead>
                                    <tr style={{ background: "#ede9fe" }}>
                                      {["#", "Product Type", "Manufacturer", "Part No# / Special Request", "QTY", "Serial No."].map((h, i) => (
                                        <th key={i} style={{ padding: "8px 14px", textAlign: "left", color: "#5b21b6", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #ddd6fe" }}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, i) => {
                                      const itemIsOther    = item.manufacturerName?.toLowerCase() === 'other';
                                      const itemIsServices = item.productType?.toLowerCase() === 'services';
                                      return (
                                        <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#faf8ff", borderBottom: "1px solid #ede9fe" }}>

                                          {/* # */}
                                          <td style={{ padding: "8px 14px", color: "#9ca3af", fontWeight: "600" }}>{String(i+1).padStart(2,'0')}</td>

                                          {/* Product Type */}
                                          <td style={{ padding: "8px 14px" }}>
                                            {item.productType ? (
                                              <span style={{ background: "#ddd6fe", color: "#5b21b6", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>
                                                {item.productType}
                                              </span>
                                            ) : <span style={{ color: "#e5e7eb" }}>—</span>}
                                          </td>

                                          {/* Manufacturer */}
                                          <td style={{ padding: "8px 14px", color: "#374151", fontWeight: "500" }}>{item.manufacturerName || <span style={{ color: "#e5e7eb" }}>—</span>}</td>

                                          {/* Part No# OR Special Request */}
                                          <td style={{ padding: "8px 14px" }}>
                                            {itemIsOther ? (
                                              item.specialRequest ? (
                                                <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", border: "1px solid #fcd34d" }}>
                                                  ✦ {item.specialRequest}
                                                </span>
                                              ) : <span style={{ color: "#e5e7eb" }}>—</span>
                                            ) : (
                                              item.partNumber
                                                ? <span style={{ color: "#374151", fontFamily: "monospace" }}>{item.partNumber}</span>
                                                : <span style={{ color: "#e5e7eb" }}>—</span>
                                            )}
                                          </td>

                                          {/* QTY - dash when services */}
                                          <td style={{ padding: "8px 14px" }}>
                                            {!itemIsServices && item.qty ? (
                                              <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bbf7d0" }}>
                                                {item.qty}
                                              </span>
                                            ) : <span style={{ color: "#e5e7eb" }}>—</span>}
                                          </td>

                                          {/* S.N. - dash when other */}
                                          <td style={{ padding: "8px 14px", color: "#374151", fontFamily: "monospace" }}>
                                            {!itemIsOther && item.serialNumber
                                              ? item.serialNumber
                                              : <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
                                          </td>

                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Showing <strong style={{color:"#1f2937"}}>{Math.min(entriesPerPage, filteredItarOrders.length)}</strong> of <strong style={{color:"#1f2937"}}>{filteredItarOrders.length}</strong> entries</span>
              <div style={{ display: "flex", gap: "4px" }}>
                {(() => {
  const total = Math.ceil(filteredItarOrders.length / entriesPerPage) || 1;
  return (
    <>
      <button onClick={() => setItarCurrentPage(p => Math.max(1, p-1))} disabled={itarCurrentPage===1}
        style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"white", color: itarCurrentPage===1?"#d1d5db":"#6b7280", cursor: itarCurrentPage===1?"not-allowed":"pointer", fontSize:"13px" }}>
        ← Prev
      </button>
      {Array.from({length: total}, (_,i) => i+1).map(page => (
        <button key={page} onClick={() => setItarCurrentPage(page)}
          style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background: page===itarCurrentPage?"linear-gradient(135deg,#667eea,#764ba2)":"white", color: page===itarCurrentPage?"white":"#6b7280", cursor:"pointer", fontSize:"13px", fontWeight: page===itarCurrentPage?"700":"400" }}>
          {page}
        </button>
      ))}
      <button onClick={() => setItarCurrentPage(p => Math.min(total, p+1))} disabled={itarCurrentPage===total}
        style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"white", color: itarCurrentPage===total?"#d1d5db":"#6b7280", cursor: itarCurrentPage===total?"not-allowed":"pointer", fontSize:"13px" }}>
        Next →
      </button>
    </>
  );
})()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}

{activeOrdersPage === "itar-detail" && selectedItarOrder && (() => {
  const order = selectedItarOrder;
  const statusSteps = ['Open', 'Backorder', 'Shipping', 'Completed', 'Voided'];
  const currentStatus = order.order_status || 'Open';

  const statusColors = {
    'Open':      { active: '#f59e0b', light: '#fffbeb', border: '#fcd34d' },
    'Backorder': { active: '#ef4444', light: '#fef2f2', border: '#fca5a5' },
    'Shipping':  { active: '#3b82f6', light: '#eff6ff', border: '#bfdbfe' },
    'Completed': { active: '#10b981', light: '#ecfdf5', border: '#6ee7b7' },
    'Voided':    { active: '#6b7280', light: '#f9fafb', border: '#e5e7eb' },
  };

  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];

const getDescription = (partNumber, manufacturerName, productType) => {
  if (!partNumber) return '';
  const matched = products?.find(p => 
    p.part_number?.trim().toLowerCase() === partNumber?.trim().toLowerCase() &&
    p.manufacturer_name?.trim().toLowerCase() === manufacturerName?.trim().toLowerCase() &&
    p.product_type?.trim().toLowerCase() === productType?.trim().toLowerCase()
  );
  return matched?.product_description || '';
};
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .ticket-btn { transition: all 0.15s ease; }
        .ticket-btn:hover { background: #1d4ed8 !important; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,0.4) !important; }
        .status-step { transition: all 0.2s ease; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "32px 32px 28px", position: "relative", overflow: "hidden", animation: "fadeSlideIn 0.4s ease" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <button onClick={() => setActiveOrdersPage('itar-list')}
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", marginBottom: "16px", display: "inline-flex", alignItems: "center", gap: "6px", backdropFilter: "blur(10px)" }}>
            ← Back
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "4px", fontWeight: "500", letterSpacing: "0.05em" }}>ITAR ORDER DETAIL</div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "white" }}>ITAR : {order.itar_no || '—'}</h1>
              {order.est_no && <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>Est # {order.est_no}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ background: "white", borderBottom: "1px solid #f3f4f6", padding: "0 32px", animation: "fadeSlideIn 0.4s ease 0.05s both" }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {statusSteps.map((step, i) => {
            const isActive = step === currentStatus;
            const sc = statusColors[step] || statusColors['Voided'];
            return (
              <div key={step} className="status-step" style={{
                padding: "14px 28px",
                fontSize: "13px",
                fontWeight: isActive ? "700" : "500",
                color: isActive ? sc.active : "#9ca3af",
                borderBottom: isActive ? `3px solid ${sc.active}` : "3px solid transparent",
                background: isActive ? sc.light : "transparent",
                cursor: "default",
                whiteSpace: "nowrap",
                position: "relative",
                transition: "all 0.2s"
              }}>
                {isActive && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sc.active, display: "inline-block", marginRight: "8px", verticalAlign: "middle" }} />}
                {step}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "28px 32px", animation: "fadeSlideIn 0.4s ease 0.1s both" }}>

        {/* Info Cards Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Order Date", value: order.order_date ? order.order_date.substring(0,10) : '—', icon: "📅" },
            { label: "Ship Date",  value: order.ship_date  ? order.ship_date.substring(0,10)  : '—', icon: "🚚" },
            { label: "Invoice No#", value: order.invoice_no || '—', icon: "🧾" },
            { label: "Location",   value: order.location   || '—', icon: "📍" },
            { label: "Assigned To", value: order.assigned_user_name || order.username || '—', icon: "👤" },
          ].map((info, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "22px" }}>{info.icon}</span>
              <div>
                <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>{info.label}</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", marginTop: "2px" }}>{info.value}</div>
              </div>
            </div>
          ))}
        </div>

       {/* Comments + Resend Payment Link - Side by Side */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
  
  {/* LEFT - Comments */}
 
<div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px", marginBottom: "24px" }}>
  <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#1f2937", display: "flex", alignItems: "center", gap: "8px" }}>
    💬 Comments
  </h3>
  <div style={{ 
    minHeight: "60px", 
    padding: "14px 18px", 
    background: "#f9fafb", 
    borderRadius: "10px", 
    border: "1px solid #f3f4f6", 
    fontSize: "14px", 
    color: order.remark ? "#374151" : "#d1d5db", 
    lineHeight: "1.6",
    wordBreak: "break-word",      /* ✅ long words break */
    overflowWrap: "break-word",   /* ✅ URLs break */
    whiteSpace: "pre-wrap",       /* ✅ newlines respect karta hai */
    maxHeight: "150px",           /* ✅ max height */
    overflowY: "auto"             /* ✅ scroll if too long */
  }}>
    {order.remark || order.comment || <em>No comments added.</em>}
  </div>
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "12px", color: "#9ca3af" }}>
    <span>Created By: {order.assigned_user_name || order.username || '—'}</span>
    <span>Updated By: —</span>
  </div>
</div>

  {/* RIGHT - Resend Payment Link (only when Open) */}
  {currentStatus === 'Open' ? (
    <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px" }}>
      <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>
        🔗 Resend payment link :
      </h3>

      {/* Extract link from comments */}
      {(() => {
        const commentText = order.remark || order.comment || '';
        const urlMatch = commentText.match(/https?:\/\/[^\s]+/);
        const extractedLink = urlMatch ? urlMatch[0] : null;

        const handleResend = async () => {
          if (!payEmail) return alert('Please enter an email address');
          if (!extractedLink) return alert('No payment link found in comments');
          setSending(true);
          try {
            const res = await fetch('http://localhost:8081/resend-payment-link', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: payEmail,
                link: extractedLink,
                itarNo: order.itar_no,
                orderId: order.id
              })
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Failed');
            alert('✅ Payment link sent!');
            setPayEmail('');
          } catch (err) {
            alert('❌ Failed: ' + err.message);
          }
          setSending(false);
        };

        return (
          <div>
            {extractedLink ? (
              <div style={{ marginBottom: "14px", padding: "8px 12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", fontSize: "12px", color: "#15803d", wordBreak: "break-all" }}>
                🔗 <a href={extractedLink} target="_blank" rel="noreferrer" style={{ color: "#15803d" }}>{extractedLink}</a>
              </div>
            ) : (
              <div style={{ marginBottom: "14px", padding: "8px 12px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fca5a5", fontSize: "12px", color: "#991b1b" }}>
                ⚠️ No payment link found in comments
              </div>
            )}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="email"
                placeholder="Email"
                value={payEmail}
                onChange={e => setPayEmail(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
              <button
                onClick={handleResend}
                disabled={sending || !extractedLink}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  background: sending || !extractedLink ? "#e5e7eb" : "linear-gradient(135deg, #667eea, #764ba2)",
                  color: sending || !extractedLink ? "#9ca3af" : "white",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: sending || !extractedLink ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap"
                }}>
                {sending ? '⏳...' : 'Send'}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  ) : (
    <div /> 
  )}
</div>

        {/* Order Tracking Table */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1f2937" }}>📦 Order Tracking</h3>
            <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
              Items
            </span>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280" }}>No items in this order</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                    {["Line", "Product Type", "Part Number", "Mfg. Name", "Description", "Qty", "Serial No.", "Ticket"].map((h, i) => (
                      <th key={i} style={{ padding: "13px 18px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
  {/* ── Main Order Row ── */}
  <tr style={{ borderBottom: "2px solid #ede9fe", background: "#faf8ff" }}>

    {/* Line */}
    <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "700", color: "#5b21b6" }}>1</td>

    {/* Product Type */}
    <td style={{ padding: "14px 18px" }}>
      {order.product_type ? (
        <span style={{
          background: order.product_type?.toLowerCase() === 'hardware' ? '#eff6ff' : order.product_type?.toLowerCase() === 'software' ? '#f0fdf4' : order.product_type?.toLowerCase() === 'services' ? '#fef3c7' : '#f5f3ff',
          color: order.product_type?.toLowerCase() === 'hardware' ? '#1d4ed8' : order.product_type?.toLowerCase() === 'software' ? '#15803d' : order.product_type?.toLowerCase() === 'services' ? '#92400e' : '#5b21b6',
          padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize"
        }}>{order.product_type}</span>
      ) : <span style={{ color: "#e5e7eb" }}>—</span>}
    </td>

    {/* Part Number */}
<td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
  {order.manufacturer_name?.toLowerCase() === 'other'
    ? <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>
    : order.part_number
      ? order.part_number
      : <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
</td>

    {/* Mfg Name */}
    <td style={{ padding: "14px 18px", fontSize: "13px", fontWeight: "600", color: "#374151" }}>
      {order.manufacturer_name || <span style={{ color: "#e5e7eb" }}>—</span>}
    </td>

   
    {/* Description */}
<td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280", maxWidth: "280px" }}>
  {order.manufacturer_name?.toLowerCase() === 'other'
    ? (order.special_request
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>
            {order.special_request}
          </div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
    : (getDescription(order.part_number, order.manufacturer_name, order.product_type)
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>
            {getDescription(order.part_number, order.manufacturer_name, order.product_type)}
          </div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
  }
</td>

    {/* QTY */}
    <td style={{ padding: "14px 18px", textAlign: "center" }}>
      {order.product_type?.toLowerCase() !== 'services' && order.qty
        ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{order.qty}</span>
        : <span style={{ color: "#e5e7eb" }}>—</span>}
    </td>

    {/* Serial No */}
    <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
      {order.manufacturer_name?.toLowerCase() !== 'other' && order.serial_number
        ? order.serial_number
        : <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
    </td>

  {/* Ticket — main row */}
<td style={{ padding: "14px 18px" }}>
  <button
    className="ticket-btn"
    onClick={() => {
      setTicketModal({ open: true, item: order, lineNo: 1 });
      setTicketForm({ email: '', comment: '', image: null });
    }}
    style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a9e)", color: "white", border: "none", padding: "7px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 2px 8px rgba(30,58,95,0.3)", whiteSpace: "nowrap" }}>
    Ticket
  </button>
</td>
  </tr>

  {/* ── Inline Item Rows ── */}
  {items.map((item, i) => {
    const isServices = item.productType?.toLowerCase() === 'services' || item.product_type?.toLowerCase() === 'services';
    const isOther    = item.manufacturerName?.toLowerCase() === 'other' || item.manufacturer_name?.toLowerCase() === 'other';
    const mfgName    = item.manufacturerName || item.manufacturer_name || '—';
    const partNum    = item.partNumber      || item.part_number      || '';
    const specialReq = item.specialRequest  || item.special_request  || '';
    const serialNo   = item.serialNumber    || item.serial_number    || '';
    const qty        = item.qty || '';
    const prodType   = item.productType     || item.product_type     || '';
   const description = getDescription(
  item.partNumber || item.part_number,
  item.manufacturerName || item.manufacturer_name,
  item.productType || item.product_type
);

    const ptColors = {
      hardware: { bg: '#eff6ff', color: '#1d4ed8' },
      software: { bg: '#f0fdf4', color: '#15803d' },
      services: { bg: '#fef3c7', color: '#92400e' },
    };
    const ptC = ptColors[prodType?.toLowerCase()] || { bg: '#f5f3ff', color: '#5b21b6' };

    return (
      <tr key={i} style={{ borderBottom: "1px solid #f9fafb", background: i % 2 === 0 ? "white" : "#fafafa" }}>

        {/* Line */}
       <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "700", color: "#6b7280" }}>{i + 2}</td>

        {/* Product Type */}
        <td style={{ padding: "14px 18px" }}>
          {prodType ? (
            <span style={{ background: ptC.bg, color: ptC.color, padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" }}>{prodType}</span>
          ) : <span style={{ color: "#e5e7eb" }}>—</span>}
        </td>

        {/* Part Number */}
<td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
  {isOther
    ? <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>
    : (partNum || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>)}
</td>

        {/* Mfg Name */}
        <td style={{ padding: "14px 18px", fontSize: "13px", fontWeight: "600", color: "#374151" }}>{mfgName}</td>

        {/* Description */}
        <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280", maxWidth: "280px" }}>
          {isOther
            ? (specialReq
                ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>
                    {specialReq}
                  </div>
                : <span style={{ color: "#e5e7eb" }}>—</span>)
            : (description
                ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }} title={description}>
                    {description}
                  </div>
                : <span style={{ color: "#e5e7eb" }}>—</span>)
          }
        </td>

        {/* Qty */}
        <td style={{ padding: "14px 18px", textAlign: "center" }}>
          {!isServices && qty
            ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{qty}</span>
            : <span style={{ color: "#e5e7eb" }}>—</span>}
        </td>

        {/* Serial No */}
        <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
          {!isOther && serialNo ? serialNo : <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
        </td>

       {/* Ticket */}
<td style={{ padding: "14px 18px" }}>
  <button
    className="ticket-btn"
    onClick={() => {
      setTicketModal({ open: true, item: item, lineNo: i + 2 });
      setTicketForm({ email: '', comment: '', image: null });
    }}
    style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a9e)", color: "white", border: "none", padding: "7px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", boxShadow: "0 2px 8px rgba(30,58,95,0.3)", whiteSpace: "nowrap" }}>
    Ticket
  </button>
</td>
      </tr>
    );
  })}
</tbody>
              </table>
            </div>
          )}

          {/* POD File */}

<PodFilesSection order={order} orderType="itar" setSelectedOrder={setSelectedItarOrder} />
        </div>

      </div>
      {/* ── CREATE TICKET MODAL ── */}
      {ticketModal.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "500px", margin: "0 16px", boxShadow: "0 24px 64px rgba(0,0,0,0.25)", overflow: "hidden", animation: "fadeSlideIn 0.25s ease" }}>

            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#1f2937" }}>Create Ticket</h3>
              <button onClick={() => setTicketModal({ open: false, item: null, lineNo: null })}
                style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#9ca3af", lineHeight: 1, padding: "2px 6px", borderRadius: "6px" }}>×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>

              {/* Upload Image */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Upload Image</label>
                <div style={{ border: "1.5px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center" }}>
                  <label style={{ background: "#f3f4f6", padding: "8px 14px", fontSize: "13px", fontWeight: "500", color: "#374151", cursor: "pointer", borderRight: "1px solid #e5e7eb", whiteSpace: "nowrap", flexShrink: 0 }}>
                    Choose File
                    <input type="file" accept="image/*" style={{ display: "none" }}
                      onChange={e => setTicketForm(f => ({ ...f, image: e.target.files[0] }))} />
                  </label>
                  <span style={{ padding: "8px 14px", fontSize: "13px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ticketForm.image ? ticketForm.image.name : 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Your Email */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Your Email</label>
                <input type="email" placeholder="Enter email" value={ticketForm.email}
                  onChange={e => setTicketForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              </div>

              {/* Comment */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Comment</label>
                <textarea placeholder="Enter comment" value={ticketForm.comment}
                  onChange={e => setTicketForm(f => ({ ...f, comment: e.target.value }))}
                  rows={4}
                  style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end", gap: "10px", background: "#fafafa" }}>
              <button onClick={() => setTicketModal({ open: false, item: null, lineNo: null })}
                style={{ padding: "9px 22px", border: "1.5px solid #e5e7eb", borderRadius: "8px", background: "white", color: "#374151", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Close
              </button>
              <button onClick={async () => {
  try {

    console.log('Full order object:', order);
    console.log('order.id:', order.id);
    console.log('order.itar_no:', order.itar_no);

    // Build FormData so image upload works too
    const formData = new FormData();
    formData.append('orderId',   order.id || order.itar_id || order.itar_no);
    formData.append('orderType', 'itar');
    formData.append('lineNo',    ticketModal.lineNo);
    formData.append('itemId',    ticketModal.item?.id || '');
    formData.append('email',     ticketForm.email);
    formData.append('comment',   ticketForm.comment);
    if (ticketForm.image) formData.append('image', ticketForm.image);

    formData.append('productType',      ticketModal.item?.product_type      || ticketModal.item?.productType      || '');
    formData.append('partNumber',       ticketModal.item?.part_number        || ticketModal.item?.partNumber        || '');
    formData.append('manufacturerName', ticketModal.item?.manufacturer_name  || ticketModal.item?.manufacturerName  || '');
    formData.append('serialNumber',     ticketModal.item?.serial_number      || ticketModal.item?.serialNumber      || '');
    formData.append('qty',              ticketModal.item?.qty                 || '');

    const desc = ticketModal.lineNo === 1
      ? (order.manufacturer_name?.toLowerCase() === 'other'
          ? (order.special_request || '')
          : getDescription(order.part_number, order.manufacturer_name, order.product_type))
      : (ticketModal.item?.manufacturer_name?.toLowerCase() === 'other' || ticketModal.item?.manufacturerName?.toLowerCase() === 'other'
          ? (ticketModal.item?.special_request || ticketModal.item?.specialRequest || '')
          : getDescription(
              ticketModal.item?.part_number || ticketModal.item?.partNumber,
              ticketModal.item?.manufacturer_name || ticketModal.item?.manufacturerName,
              ticketModal.item?.product_type || ticketModal.item?.productType
            ));
    formData.append('description', desc || '');

   const res = await fetch('http://localhost:8081/tickets', {
      method: 'POST',
      body: formData,       
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed');
    alert(`Ticket created for Line ${ticketModal.lineNo}!`);
    setTicketModal({ open: false, item: null, lineNo: null });
    setTicketForm({ email: '', comment: '', image: null });

  } catch (err) {
    alert('Error creating ticket: ' + err.message);
  }
}}
                style={{ padding: "9px 22px", border: "none", borderRadius: "8px", background: "linear-gradient(135deg, #1e3a5f, #2d5a9e)", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(30,58,95,0.3)" }}>
                Create Ticket
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
})()}

            {activeOrdersPage === "itar-report" && (
              <div>
                <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>ITAR Orders - Report</h1>
                <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid #e0e0e0" }}>
                    <button onClick={() => setReportFilters({...reportFilters, reportType: 'location'})} style={{ padding: "12px 24px", background: reportFilters.reportType === 'location' ? "#2c5282" : "transparent", color: reportFilters.reportType === 'location' ? "white" : "#666", border: "none", borderBottom: reportFilters.reportType === 'location' ? "3px solid #2c5282" : "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>🌍 ITAR REPORT LOCATION WISE</button>
                    <button onClick={() => setReportFilters({...reportFilters, reportType: 'product'})} style={{ padding: "12px 24px", background: reportFilters.reportType === 'product' ? "#2c5282" : "transparent", color: reportFilters.reportType === 'product' ? "white" : "#666", border: "none", borderBottom: reportFilters.reportType === 'product' ? "3px solid #2c5282" : "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>📦 ITAR REPORT PRODUCT TYPE</button>
                  </div>

                  {reportFilters.reportType === 'location' ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Status</label>
                        <select value={reportFilters.orderStatus} onChange={(e) => setReportFilters({...reportFilters, orderStatus: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                          <option value="">Select order status</option>
                          <option value="Backorder">Backorder</option>
                          <option value="Open">Open</option>
                          <option value="Completed">Completed</option>
                          <option value="Voided">Voided</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Location</label>
                        <select value={reportFilters.location} onChange={(e) => setReportFilters({...reportFilters, location: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                          <option value="">Select Location</option>
                          <option value="Pickering">Pickering</option>
                          <option value="fgh">fgh</option>
                          <option value="fghf">fghf</option>
                          <option value="test location">test location</option>
                          <option value="13">13</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Product Type</label>
                        <select value={reportFilters.productType} onChange={(e) => setReportFilters({...reportFilters, productType: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                          <option value="">Select a option</option>
                          <option value="hardware">Hardware</option>
                          <option value="software">Software</option>
                          <option value="services">Services</option>
                          
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Manufacturer Name</label>
                        <select value={reportFilters.manufacturerName} onChange={(e) => setReportFilters({...reportFilters, manufacturerName: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                          <option value="">Select Manufacturer Name</option>
{manufacturers.map((m) => (
  <option key={m.id} value={m.name}>{m.name}</option>
))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Part Number</label>
                        <select value={reportFilters.partNumber} onChange={(e) => setReportFilters({...reportFilters, partNumber: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
  <option value="">Select</option>
  {products
    .filter(p => p.product_type === reportFilters.productType?.toLowerCase() && p.part_number)
    .map((p, i) => (
      <option key={i} value={p.part_number}>{p.part_number}</option>
    ))
  }
</select>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                    <button type="button" onClick={() => {
                      const orders = getFilteredReportOrders();
                      if (orders.length === 0) { alert("❌ No data to copy!"); return; }
                      const headers = "ITAR No#\tInvoice No#\tOrder Date\tShip Date\tStatus\tLocation\tProduct Type\tManufacturer Name\tPart No";
                      const rows = orders.map(o => `${o.itar_no || ''}\t${o.invoice_no || ''}\t${formatDate(o.order_date)}\t${formatDate(o.ship_date)}\t${o.order_status || ''}\t${o.location || ''}\t${o.product_type || ''}\t${o.manufacturer_name || ''}\t${o.part_number || ''}`).join('\n');
                      navigator.clipboard.writeText(headers + '\n' + rows).then(() => alert('✅ Copied!')).catch(() => alert('❌ Copy failed!'));
                    }} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Copy</button>

                    <button type="button" onClick={() => {
                      const orders = getFilteredReportOrders();
                      if (orders.length === 0) { alert("❌ No data!"); return; }
                      const headers = ['ITAR No#','Invoice No#','Order Date','Ship Date','Status','Location','Product Type','Manufacturer Name','Part No'];
                      const rows = orders.map(o => [o.itar_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.product_type||'', o.manufacturer_name||'', o.part_number||'']);
                      const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href = url; a.download = 'itar_orders_report.csv'; a.click();
                      URL.revokeObjectURL(url);
                    }} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>CSV</button>

                    <button type="button" onClick={() => {
                      const orders = getFilteredReportOrders();
                      if (orders.length === 0) { alert("❌ No data!"); return; }
                      const wsData = [
                        ['ITAR No#','Invoice No#','Order Date','Ship Date','Status','Location','Product Type','Manufacturer Name','Part No'],
                        ...orders.map(o => [o.itar_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.product_type||'', o.manufacturer_name||'', o.part_number||''])
                      ];
                      const ws = XLSX.utils.aoa_to_sheet(wsData);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, 'ITAR Orders');
                      XLSX.writeFile(wb, 'itar_orders_report.xlsx');
                    }} style={{ padding: "8px 16px", background: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Excel</button>

                    <button type="button" onClick={() => {
                      const orders = getFilteredReportOrders();
                      if (orders.length === 0) { alert("❌ No data!"); return; }
                      const rows = orders.map(o => `<tr><td>${o.itar_no||''}</td><td>${o.invoice_no||''}</td><td>${formatDate(o.order_date)}</td><td>${formatDate(o.ship_date)}</td><td>${o.order_status||''}</td><td>${o.location||''}</td><td>${o.product_type||''}</td><td>${o.manufacturer_name||''}</td><td>${o.part_number||''}</td></tr>`).join('');
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>ITAR Orders Report</title><style>body{font-family:Arial,sans-serif;font-size:12px;margin:20px}table{width:100%;border-collapse:collapse}th{background:#2c5282;color:white;padding:8px;text-align:left;font-size:11px}td{border:1px solid #ddd;padding:8px;font-size:11px}tr:nth-child(even){background:#f2f2f2}</style></head><body><h2>ITAR Orders Report</h2><p>Total: ${orders.length}</p><table><thead><tr><th>ITAR No#</th><th>Invoice No#</th><th>Order Date</th><th>Ship Date</th><th>Status</th><th>Location</th><th>Product Type</th><th>Manufacturer</th><th>Part No</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
                      printWindow.document.close(); printWindow.focus(); printWindow.print();
                    }} style={{ padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Print</button>

                    <button type="button" onClick={() => {
                      const orders = getFilteredReportOrders();
                      if (orders.length === 0) { alert("❌ No data!"); return; }
                      const doc = new jsPDF({ orientation: 'landscape' });
                      doc.setFontSize(14); doc.text('ITAR Orders Report', 14, 15);
                      autoTable(doc, {
                        head: [['ITAR No#','Invoice No#','Order Date','Ship Date','Status','Location','Product Type','Manufacturer','Part No']],
                        body: orders.map(o => [o.itar_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.product_type||'', o.manufacturer_name||'', o.part_number||'']),
                        startY: 28, styles: { fontSize: 8 }, headStyles: { fillColor: [44, 82, 130] }
                      });
                      doc.save('itar_orders_report.pdf');
                    }} style={{ padding: "8px 16px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>PDF</button>

                    <div style={{ marginLeft: "auto" }}>
                      <input type="text" placeholder="Search:" style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" }} />
                    </div>
                  </div>

                  {getFilteredReportOrders().length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No orders found matching the selected filters</div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>ITAR No#</th>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Invoice No#</th>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Order Date</th>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Ship Date</th>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Status</th>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Location</th>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Product Type</th>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Manufacturer Name</th>
                            <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Part No</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* FIX: was order.itarNo, order.invoiceNo, order.orderDate etc. */}
                          {getFilteredReportOrders().map((order) => (
                            <tr key={order.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.itar_no}</td>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.invoice_no}</td>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{formatDate(order.order_date)}</td>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{formatDate(order.ship_date)}</td>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.order_status}</td>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.location}</td>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.product_type}</td>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.manufacturer_name}</td>
                              <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.part_number}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>
                        Showing 1 to {getFilteredReportOrders().length} of {getFilteredReportOrders().length} entries
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {activeOrdersPage === "hardware-orders-create" && (
            <div>
              <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>
                {editingHardwareOrderId ? 'Hardware Orders - Edit' : 'Hardware Orders - Create'}
              </h1>
              <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Date /y</label>
                    <input type="date" value={hardwareOrderForm.orderDate} onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, orderDate: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Est #</label>
                    <input type="text" value={hardwareOrderForm.estNo} onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, estNo: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
                  </div>
                </div>
                
                {/* Product Type + Manufacturer + Part Number */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Product Type</label>
    <select value={hardwareOrderForm.productType}
      onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, productType: e.target.value, partNumber: '', manufacturerName: '', specialRequest: ''})}
      style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
      <option value="">Select Product Type</option>
      <option value="hardware">Hardware</option>
      <option value="software">Software</option>
      <option value="services">Services</option>
    </select>
  </div>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Manufacturer Name</label>
    <select value={hardwareOrderForm.manufacturerName}
      onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, manufacturerName: e.target.value, partNumber: '', specialRequest: ''})}
      style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
      <option value="">Select Manufacturer Name</option>
      {manufacturers.map((m) => (
        <option key={m.id} value={m.name}>{m.name}</option>
      ))}
    </select>
  </div>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Part Number</label>
    {hardwareOrderForm.manufacturerName?.toLowerCase() === 'other' ? (
      <input type="text"
        value={hardwareOrderForm.specialRequest || ''}
        onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, specialRequest: e.target.value})}
        placeholder="Enter special request..."
        style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
    ) : (
      <select value={hardwareOrderForm.partNumber}
        onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, partNumber: e.target.value})}
        disabled={!hardwareOrderForm.productType}
        style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
        <option value="">Select Part Number</option>
        {getItarPartByType(hardwareOrderForm.productType, hardwareOrderForm.manufacturerName)
  .map((partNum, i) => (
    <option key={i} value={partNum}>{partNum}</option>
  ))
}
      </select>
    )}
  </div>
</div>

<div style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "flex-end" }}>

  {/* Select User */}
  <div style={{ width: "450px" }}>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select User</label>
    <select value={hardwareOrderForm.selectedUser}
      onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, selectedUser: e.target.value})}
      style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
      <option value="">Select User</option>
      {data.map((profile) => (<option key={profile.id} value={profile.id}>{profile.name} ({profile.username})</option>))}
    </select>
  </div>

  {(() => {
    const isOther = hardwareOrderForm.manufacturerName?.toLowerCase() === 'other';
    const isServices = hardwareOrderForm.productType === 'services';
    return (
      <>
        {/* QTY */}
        {!isServices && (
          <div style={{ width: "200px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>QTY #</label>
            <input type="number" value={hardwareOrderForm.qty}
              onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, qty: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
          </div>
        )}

        {/* S.N. */}
        {!isOther && (
          <div style={{ width: "260px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>S.N. #</label>
            <input type="text" value={hardwareOrderForm.serialNumber}
              onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, serialNumber: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
          </div>
        )}
      </>
    );
  })()}

</div>

                <div style={{ marginBottom: "28px" }}>
  {hardwareItemRows.map((row, idx) => {
  const isOtherRow = row.manufacturerName?.toLowerCase() === 'other';
  const isServicesRow = row.productType === 'services';
  return (
  <div key={row.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
      <div style={{ position: "relative", flex: 1.2, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
        <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
          {idx === 0 ? "Select Product Type" : "Type Of Product"}
        </span>
        
        <select value={row.productType} onChange={e => { updateHardwareRow(row.id, "productType", e.target.value); updateHardwareRow(row.id, "partNumber", ""); }}
  style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
  <option value=""></option>
  <option value="hardware">Hardware</option>
  <option value="software">Software</option>
  <option value="services">Services</option>
</select>
        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
      </div>
      <div style={{ position: "relative", flex: 1.2, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
        <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
          {idx === 0 ? "Select Manufacturer Name" : "Manufacturer Name"}
        </span>
        <select value={row.manufacturerName} onChange={e => updateHardwareRow(row.id, "manufacturerName", e.target.value)}
          style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
          <option value="">Select Manufacturer Name</option>
{manufacturers.map((m) => (
  <option key={m.id} value={m.name}>{m.name}</option>
))}
        </select>
        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
      </div>
       <div style={{ position: "relative", flex: 1.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
        <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
          {idx === 0 ? "Select Part Number" : "Part Number"}
        </span>
      {row.manufacturerName?.toLowerCase() === 'other' ? (
  <input type="text" value={row.specialRequest || ''}
    onChange={e => updateHardwareRow(row.id, "specialRequest", e.target.value)}
    placeholder="Enter special request..."
    style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
) : (
  <select value={row.partNumber}
    onChange={e => updateHardwareRow(row.id, "partNumber", e.target.value)}
    style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
    <option value=""></option>
    {getItarPartByType(row.productType, row.manufacturerName)
      .map((partNum, i) => (
        <option key={i} value={partNum}>{partNum}</option>
      ))
    }
  </select>
)}
        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
      </div>
      {!isServicesRow && (
        <div style={{ position: "relative", flex: 0.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
          <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", zIndex: 1 }}>
            {idx === 0 ? "QTY #" : "QTY#"}
          </span>
          <input type="number" min="1" value={row.qty} onChange={e => updateHardwareRow(row.id, "qty", e.target.value)}
            style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
        </div>
      )}
      {!isOtherRow && (
        <div style={{ position: "relative", flex: 0.7, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
          <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", zIndex: 1 }}>
            {idx === 0 ? "S.N. #" : "S.N.#"}
          </span>
          <input type="text" value={row.serialNumber} onChange={e => updateHardwareRow(row.id, "serialNumber", e.target.value)}
            style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
        </div>
      )}
      <button onClick={() => removeHardwareRow(row.id)}
        style={{ width: "34px", height: "34px", flexShrink: 0, borderRadius: "50%", background: "#1a2a4a", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
        ✕
      </button>
    </div>
  );
})}
  <button onClick={addHardwareRow}
    style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#4a5568", color: "#fff", border: "none", cursor: "pointer", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
    ＋
  </button>
</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Location</label>
    <input type="text" value={hardwareOrderForm.location} onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, location: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
  </div>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Hardware #</label>
    <input type="text" value={hardwareOrderForm.hardwareNo} onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, hardwareNo: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
  </div>
</div>


{/* ── POD FILE UPLOAD — sirf edit mode mein ── */}
{editingHardwareOrderId && (
  <div style={{ marginBottom: "20px", padding: "20px", background: "#f0fdf4",
    borderRadius: "10px", border: "1px solid #bbf7d0" }}>
    <label style={{ display: "block", marginBottom: "12px", fontWeight: "700",
      fontSize: "13px", color: "#065f46" }}>
      📎 POD File
    </label>

    {/* ── Existing uploaded files ── */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
      {Array.isArray(hardwarePodFiles) && hardwarePodFiles.length > 0 ? (
        hardwarePodFiles.map((file, fi) => (
          <div key={file.id || fi} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <a href={`http://localhost:8081/uploads/${file.filename}`}
              target="_blank" rel="noreferrer" download={file.original_name}
              style={{ background: "linear-gradient(135deg,#1e3a5f,#2d5a9e)", color: "white",
                padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              📥 {file.original_name || `POD File ${fi + 1}`}
            </a>
            <button onClick={async () => {
                if (!window.confirm('Delete this POD file?')) return;
                await axios.delete(`http://localhost:8081/orders/hardware/pod-files/${file.id}`);
                setHardwarePodFiles(prev => prev.filter((_,i) => i !== fi));
              }}
              style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca",
                padding: "8px 10px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
              🗑️
            </button>
          </div>
        ))
      ) : (
        <span style={{ fontSize: "13px", color: "#9ca3af" }}>No files uploaded yet</span>
      )}
    </div>

    {/* ── New file inputs (AV POS pattern) ── */}
    <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600",
      marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      Add New Files:
    </div>
    {hardwareFileInputs.map((fileInput, index) => (
      <div key={fileInput.id} style={{ display: "flex", gap: "10px", alignItems: "center",
        marginBottom: index < hardwareFileInputs.length - 1 ? "10px" : "0" }}>
        <input type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setHardwareSelectedFiles(prev => {
              const filtered = prev.filter(f => f.inputId !== fileInput.id);
              return [...filtered, { inputId: fileInput.id, file }];
            });
          }}
          style={{ flex: 1, padding: "8px", border: "1px solid #ddd",
            borderRadius: "4px", fontSize: "14px", background: "white" }}
        />
        {index === 0 ? (
          <button type="button" onClick={handleAddHardwareFile}
            style={{ padding: "8px 24px", background: "#059669", color: "white",
              border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
            Add
          </button>
        ) : (
          <button type="button" onClick={() => {
              handleRemoveHardwareFile(fileInput.id);
              setHardwareSelectedFiles(prev => prev.filter(f => f.inputId !== fileInput.id));
            }}
            style={{ padding: "8px 18px", background: "#ef4444", color: "white",
              border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
            X
          </button>
        )}
      </div>
    ))}
  </div>
)}

{/* Ship Date + Invoice # */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Ship Date /y</label>
    <input type="date" value={hardwareOrderForm.shipDate} onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, shipDate: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
  </div>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Invoice #</label>
    <input type="text" value={hardwareOrderForm.invoiceNo} onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, invoiceNo: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
  </div>
</div>
               {/* Inline Item Rows */}

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Status #</label>
                  <select value={hardwareOrderForm.orderStatus} onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, orderStatus: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                    <option value="">Select a order status</option>
                    <option value="Backorder">Backorder</option>
                    <option value="Open">Open</option>
                    <option value="Completed">Completed</option>
                    <option value="Voided">Voided</option>
                  </select>
                </div>

                {/* Remark / Comment */}
<div style={{ marginBottom: "20px" }}>
  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Remark / Comment</label>
  <textarea
    value={hardwareOrderForm.remark || ''}
    onChange={(e) => setHardwareOrderForm({...hardwareOrderForm, remark: e.target.value})}
    placeholder="Enter remark or comment..."
    rows={4}
    style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
</div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button onClick={handleResetHardwareForm} style={{ background: "#6c757d", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Reset</button>
                  <button onClick={handleSaveHardwareOrder} style={{ background: "#5cb85c", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                    💾 {editingHardwareOrderId ? 'Update Order' : 'Save Order'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeOrdersPage === "hardware-orders-list" && (
  <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
    <style>{`
      .hw-row:hover { box-shadow: -3px 0 0 #10b981 !important; background: linear-gradient(90deg, #ecfdf5 0%, #f8fffe 100%) !important; }
    `}</style>

    <div style={{ background: "linear-gradient(135deg, #0f766e 0%, #059669 100%)", padding: "32px 32px 80px", position: "relative", overflow: "hidden", animation: "fadeSlideIn 0.4s ease" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em", display: "inline-block", marginBottom: "10px" }}>ORDERS MANAGEMENT</span>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>Hardware Orders</h1>
          <p style={{ margin: "6px 0 0", fontSize: "15px", color: "rgba(255,255,255,0.75)" }}>Track all hardware procurement orders</p>
        </div>
        {hasPermission('Hardware-orders-Add') && (
  <button onClick={() => { setEditingHardwareOrderId(null); setHardwareOrderForm({ orderDate:'',estNo:'',selectedUser:'',productType:'',manufacturerName:'',partNumber:'',qty:'',serialNumber:'',location:'',hardwareNo:'',shipDate:'',invoiceNo:'',orderStatus:'', remark:'' }); setActiveOrdersPage('hardware-orders-create'); }}
    style={{ background: "white", color: "#0f766e", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
    <span style={{ fontSize: "18px" }}>+</span> New Hardware Order
  </button>
)}
      </div>
    </div>

    <div style={{ padding: "0 32px", marginTop: "-44px", position: "relative", zIndex: 10, animation: "fadeSlideIn 0.5s ease 0.1s both" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {[
          { label: "Total Orders", value: hardwareOrders.length, icon: "🖥️", color: "#059669", light: "#ecfdf5" },
          { label: "Open", value: hardwareOrders.filter(o => o.order_status === 'Open').length, icon: "🔓", color: "#f59e0b", light: "#fffbeb" },
          { label: "Completed", value: hardwareOrders.filter(o => o.order_status === 'Completed').length, icon: "✅", color: "#10b981", light: "#d1fae5" },
          { label: "Backorder", value: hardwareOrders.filter(o => o.order_status === 'Backorder').length, icon: "⏳", color: "#ef4444", light: "#fef2f2" },
          { label: "Voided", value: hardwareOrders.filter(o => o.order_status === 'Voided').length, icon: "📪", color: "#6b7280", light: "#f9fafb" },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ background: "white", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: stat.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: "30px", fontWeight: "800", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px", fontWeight: "500" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: "24px 32px 32px", animation: "fadeSlideIn 0.5s ease 0.2s both" }}>
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Show</span>
            <select value={hardwareEntriesPerPage} onChange={(e) =>{ setHardwareEntriesPerPage(Number(e.target.value)); setHardwareCurrentPage(1); }}
              style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "white" }}>
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
            </select>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>entries</span>
            <span style={{ marginLeft: "8px", background: "#d1fae5", color: "#065f46", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{filteredHardwareOrders.length} records</span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔍</span>
            <input type="text" placeholder="Search hardware orders..." value={hardwareListSearchTerm} onChange={(e) => setHardwareListSearchTerm(e.target.value)}
              style={{ padding: "9px 14px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "13px", width: "240px", color: "#374151" }} />
          </div>
        </div>

        {filteredHardwareOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🖥️</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>No Hardware Orders Yet</div>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "6px" }}>Create your first hardware order</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1500px" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                    {["#", "Order No#", "Assigned User","Order Date", "Est #",  "Product Type", "Manufacturer", "SPLIT", "QTY", "Serial No#", "Location", "Ship Date", "Invoice No#",  "Status", "Remark", "Actions"].map((h, i) => (
  <th key={i} style={{ padding: "13px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
    {h === "SPLIT" ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "700", border: "1px solid #bfdbfe", display: "inline-block" }}>
          # Part No
        </span>
        <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "700", border: "1px solid #fcd34d", display: "inline-block" }}>
          ✦ Special Request
        </span>
      </div>
    ) : h}
  </th>
))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHardwareOrders.slice(
  (hardwareCurrentPage - 1) * hardwareEntriesPerPage,
  hardwareCurrentPage * hardwareEntriesPerPage
).map((order, idx) => {

                    const name = order.assigned_user_name || order.assigned_username || '';
                    const initials = name ? name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : '?';
                    const avatarPalette = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];
                    const avatarBg = avatarPalette[(order.id || idx) % avatarPalette.length];
                    const statusConfig = {
                      'Completed': { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7', dot: '#10b981' },
                      'Open': { bg: '#fffbeb', color: '#92400e', border: '#fcd34d', dot: '#f59e0b' },
                      'Backorder': { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5', dot: '#ef4444' },
                      'Voided': { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb', dot: '#9ca3af' },
                    };
                    const sc = statusConfig[order.order_status] || statusConfig['Voided'];
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="order-row hw-row" style={{ borderBottom: "1px solid #f9fafb" }}>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#d1d5db", fontWeight: "600" }}>{String(idx+1).padStart(2,'00')}</td>
<td style={{ padding: "14px 16px" }}>
  <span
    onClick={async () => {
  setSelectedHardwareOrder(order);
  setWarranties({});
  
  console.log("🔍 order.items:", order.items);
  if (Array.isArray(order.items) && order.items.length > 0) {
    const results = {};
    for (const item of order.items) {
      console.log("🔍 item.id:", item.id);
      if (!item.id) continue;
      try {
        const res = await axios.get(`http://localhost:8081/warranty/${item.id}`);
        console.log("✅ warranty response:", res.data);
        if (res.data) {
          results[item.id] = {
            serialNumber: res.data.serial_number || '',
            productName: res.data.product_name || '',
            purchaseDate: res.data.purchase_date ? res.data.purchase_date.substring(0, 10) : '',
            expiryDate: res.data.expiry_date ? res.data.expiry_date.substring(0, 10) : '',
          };
        }
      } catch (e) {
        console.log("⚠️ no warranty for item", item.id, e.message);
      }
    }
    console.log("✅ final results:", results);
    setWarranties(results);

  }
  try {
    const podRes = await axios.get(`http://localhost:8081/orders/hardware/${order.id}/pod-files`);
    setSelectedHardwareOrder({ ...order, pod_files: podRes.data });
  } catch (e) {
    setSelectedHardwareOrder({ ...order, pod_files: [] });
  }
  setActiveOrdersPage('hardware-orders-detail');
}}
    style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", color: "#065f46", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
    {order.hardware_no || '—'}
  </span>
</td>
<td style={{ padding: "14px 16px" }}>
                            {name ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", flexShrink: 0, boxShadow: `0 2px 8px ${avatarBg}55` }}>{initials}</div>
                                <div>
                                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#1f2937" }}>{order.assigned_user_name || name}</div>
                                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>@{order.assigned_username}</div>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>👤</div>
                                <span style={{ fontSize: "12px", color: "#d1d5db" }}>Unassigned</span>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(order.order_date) || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{order.est_no || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.product_type || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.manufacturer_name || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px" }}>
  {order.manufacturer_name?.toLowerCase() === 'other' ? (
    order.special_request ? (
      <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #fcd34d" }}>
        ✦ {order.special_request}
      </span>
    ) : <span style={{color:"#e5e7eb"}}>—</span>
  ) : (
    order.part_number ? (
      <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #bfdbfe", fontFamily: "monospace" }}>
        # {order.part_number}
      </span>
    ) : <span style={{color:"#e5e7eb"}}>—</span>
  )}
</td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            {order.qty ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{order.qty}</span> : <span style={{color:"#e5e7eb"}}>—</span>}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "12px", color: "#374151", fontFamily: "monospace" }}>{order.serial_number || <span style={{color:"#e5e7eb",fontFamily:"sans-serif"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.location || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(order.ship_date) || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.invoice_no || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                              {order.order_status || '—'}
                            </span>
                          </td>
                          {/* Remark column */}
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", maxWidth: "200px" }}>
                            {order.remark || order.comment
                              ? <span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{order.remark || order.comment}</span>
                              : <span style={{ color: "#e5e7eb" }}>—</span>}
                          </td>
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            {Array.isArray(order.items) && order.items.length > 0 && (
                              <button onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                style={{ background: expandedOrderId === order.id ? "#d1fae5" : "#f0fdf4", color: "#065f46", border: "1px solid #6ee7b7", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginRight: "6px" }}>
                                {expandedOrderId === order.id ? "▲" : "▼"} {order.items.length}
                              </button>
                            )}
                            {hasPermission('Hardware-orders-Edit') && (
<button className="action-btn edit-btn" onClick={async () => {
  const profile = data.find(p => p.username === order.assigned_username);
  setHardwareOrderForm({
    orderDate: order.order_date ? order.order_date.toString().split('T')[0] : '',
    estNo: order.est_no || '',
    selectedUser: profile ? String(profile.id) : '',
    productType: order.product_type || '',
    manufacturerName: order.manufacturer_name || '',
    partNumber: order.part_number || '',
    specialRequest: order.special_request || '',
    qty: order.qty != null ? String(order.qty) : '',
    serialNumber: order.serial_number || '',
    location: order.location || '',
    hardwareNo: order.hardware_no || '',
    shipDate: order.ship_date ? order.ship_date.toString().split('T')[0] : '',
    invoiceNo: order.invoice_no || '',
    orderStatus: order.order_status || '',
    remark: order.remark || order.comment || ''
  });
  setHardwareItemRows(Array.isArray(order.items) && order.items.length > 0 ? order.items : []);
  setEditingHardwareOrderId(order.id);
  setHardwarePodFiles([]);
  try {
    const podRes = await axios.get(`http://localhost:8081/orders/hardware/${order.id}/pod-files`);
    setHardwarePodFiles(podRes.data);
  } catch (e) {
    console.log('No pod files');
  }
  setActiveOrdersPage('hardware-orders-create');
}}
  style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", marginRight: "6px" }}>✏️ Edit
</button>
)}

{hasPermission('Hardware-orders-Delete') && (
<button className="action-btn del-btn" onClick={() => handleDeleteHardwareOrder(order.id)}
  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>🗑️</button>
)}
                          </td>
                        </tr>
                        {expandedOrderId === order.id && Array.isArray(order.items) && order.items.length > 0 && (
                          <tr>
                            <td colSpan={16} style={{ padding: 0, background: "#f0fdf9" }}>
                              <div style={{ padding: "14px 24px 18px 48px", borderBottom: "2px solid #6ee7b7", borderTop: "1px solid #6ee7b7" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#065f46", letterSpacing: "0.05em" }}>📦 ITEM ROWS</span>
                                  <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{order.items.length} items</span>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                  <thead>
                                    <tr style={{ background: "#d1fae5" }}>
                                      {["#", "Product Type", "Manufacturer", "Part Number", "QTY", "Serial No."].map((h, i) => (
                                        <th key={i} style={{ padding: "8px 14px", textAlign: "left", color: "#065f46", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #6ee7b7" }}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, i) => (
                                      <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f0fdf4", borderBottom: "1px solid #d1fae5" }}>
                                        <td style={{ padding: "8px 14px", color: "#9ca3af", fontWeight: "600" }}>{String(i+1).padStart(2,'0')}</td>
                                        <td style={{ padding: "8px 14px" }}>
                                          {item.productType ? <span style={{ background: "#d1fae5", color: "#065f46", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>{item.productType}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
                                        </td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontWeight: "500" }}>{item.manufacturerName || <span style={{ color: "#e5e7eb" }}>—</span>}</td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontFamily: "monospace" }}>{item.partNumber || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}</td>
                                        <td style={{ padding: "8px 14px" }}>
                                          {item.qty ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{item.qty}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
                                        </td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontFamily: "monospace" }}>{item.serialNumber || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Showing <strong style={{color:"#1f2937"}}>{Math.min(hardwareEntriesPerPage, filteredHardwareOrders.length)}</strong> of <strong style={{color:"#1f2937"}}>{filteredHardwareOrders.length}</strong> entries</span>
              <div style={{ display: "flex", gap: "4px" }}>
                {(() => {
  const total = Math.ceil(filteredHardwareOrders.length / hardwareEntriesPerPage) || 1;
  return (
    <>
      <button onClick={() => setItarCurrentPage(p => Math.max(1, p-1))} disabled={itarCurrentPage===1}
        style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"white", color: itarCurrentPage===1?"#d1d5db":"#6b7280", cursor: itarCurrentPage===1?"not-allowed":"pointer", fontSize:"13px" }}>
        ← Prev
      </button>
      {Array.from({length: total}, (_,i) => i+1).map(page => (
        <button key={page} onClick={() => setItarCurrentPage(page)}
          style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background: page===itarCurrentPage?"linear-gradient(135deg,#667eea,#764ba2)":"white", color: page===itarCurrentPage?"white":"#6b7280", cursor:"pointer", fontSize:"13px", fontWeight: page===itarCurrentPage?"700":"400" }}>
          {page}
        </button>
      ))}
      <button onClick={() => setItarCurrentPage(p => Math.min(total, p+1))} disabled={itarCurrentPage===total}
        style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"white", color: itarCurrentPage===total?"#d1d5db":"#6b7280", cursor: itarCurrentPage===total?"not-allowed":"pointer", fontSize:"13px" }}>
        Next →
      </button>
    </>
  );
})()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
           )}

           {activeOrdersPage === "hardware-orders-detail" && selectedHardwareOrder && (() => {
  const order   = selectedHardwareOrder;
  const BASE    = 'http://localhost:8081';
  const items   = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];

  const getKey = (item, lineNo) => {
  if (item?.id) return String(item.id);        
  return `order-${order.id}`;                    
};


  // ── open Add/Update modal ─────────────────────────────────────────
  const openAddWarranty = (item, lineNo) => {
    const key      = getKey(item, lineNo);
    const existing = warranties[key];
    setWarrantyForm({
      serialNumber: existing?.serialNumber ?? (item?.serialNumber || item?.serial_number || order.serial_number || ''),
      productName:  existing?.productName  ?? (item?.partNumber   || item?.part_number   || order.part_number   || ''),
      purchaseDate: existing?.purchaseDate ?? '',
      expiryDate:   existing?.expiryDate   ?? '',
    });
    setWarrantyModal({ open: true, mode: 'add', item: item ?? null, lineNo });
  };

  const openViewWarranty = (item, lineNo) => {
    setWarrantyModal({ open: true, mode: 'view', item: item ?? null, lineNo });
  };

 const handleSaveWarranty = async () => {
  const key      = getKey(warrantyModal.item, warrantyModal.lineNo);
  const isInline = !!warrantyModal.item?.id;
  const isUpdate = !!warranties[key];

  try {
    if (isInline) {
      // ✅ Inline item — use hardware_order_inline_id
      const inlineId = warrantyModal.item.id;
      if (isUpdate) {
        await axios.put(`${BASE}/warranty/${inlineId}`, {
          serialNumber: warrantyForm.serialNumber,
          productName:  warrantyForm.productName,
          purchaseDate: warrantyForm.purchaseDate,
          expiryDate:   warrantyForm.expiryDate,
        });
      } else {
        await axios.post(`${BASE}/warranty`, {
          hardwareOrderInlineId: inlineId,
          serialNumber:          warrantyForm.serialNumber,
          productName:           warrantyForm.productName,
          purchaseDate:          warrantyForm.purchaseDate,
          expiryDate:            warrantyForm.expiryDate,
        });
      }
    } else {
      // ✅ Main order line — use hardware_order_id
      if (isUpdate) {
        await axios.put(`${BASE}/warranty/order-main/${order.id}`, {
          serialNumber: warrantyForm.serialNumber,
          productName:  warrantyForm.productName,
          purchaseDate: warrantyForm.purchaseDate,
          expiryDate:   warrantyForm.expiryDate,
        });
      } else {
        await axios.post(`${BASE}/warranty/order-main`, {
          hardwareOrderId: order.id,        // ✅ sends order.id not inline id
          serialNumber:    warrantyForm.serialNumber,
          productName:     warrantyForm.productName,
          purchaseDate:    warrantyForm.purchaseDate,
          expiryDate:      warrantyForm.expiryDate,
        });
      }
    }

    // ✅ Update local state
    setWarranties(prev => ({
      ...prev,
      [key]: {
        serialNumber: warrantyForm.serialNumber,
        productName:  warrantyForm.productName,
        purchaseDate: warrantyForm.purchaseDate,
        expiryDate:   warrantyForm.expiryDate,
      }
    }));

    setWarrantyModal({ open: false, mode: '', item: null, lineNo: null });
    alert(isUpdate ? '✅ Warranty updated!' : '✅ Warranty saved!');

  } catch (err) {
    alert(`❌ Failed: ${err.response?.data?.error || err.message}`);
  }
};

  const getDescription = (partNumber, manufacturerName, productType) => {
    if (!partNumber) return '';
    return products?.find(p =>
      p.part_number?.trim().toLowerCase()       === partNumber?.trim().toLowerCase()      &&
      p.manufacturer_name?.trim().toLowerCase() === manufacturerName?.trim().toLowerCase() &&
      p.product_type?.trim().toLowerCase()      === productType?.trim().toLowerCase()
    )?.product_description || '';
  };

  const statusSteps   = ['Open', 'Backorder', 'Shipping', 'Completed', 'Voided'];
  const currentStatus = order.order_status || 'Open';
  const statusColors  = {
    Open:      { active: '#f59e0b', light: '#fffbeb' },
    Backorder: { active: '#ef4444', light: '#fef2f2' },
    Shipping:  { active: '#3b82f6', light: '#eff6ff' },
    Completed: { active: '#10b981', light: '#ecfdf5' },
    Voided:    { active: '#6b7280', light: '#f9fafb' },
  };
  const ptColors = {
    hardware: { bg: '#eff6ff', color: '#1d4ed8' },
    software: { bg: '#f0fdf4', color: '#15803d' },
    services: { bg: '#fef3c7', color: '#92400e' },
  };
  const ptColor = (type) => ptColors[type?.toLowerCase()] || { bg: '#f5f3ff', color: '#5b21b6' };
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#374151', fontFamily: 'inherit' };
  const focusGreen  = e => (e.target.style.borderColor = '#10b981');
  const blurGray    = e => (e.target.style.borderColor = '#e5e7eb');

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh', background: '#f0f2f5' }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .hw-btn { transition: all .15s ease; }
        .hw-btn:hover { opacity: .85; transform: translateY(-1px); }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg,#0f766e 0%,#059669 100%)', padding: '32px 32px 28px', position: 'relative', overflow: 'hidden', animation: 'fadeSlideIn .4s ease' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button className="hw-btn" onClick={() => setActiveOrdersPage('hardware-orders-list')}
            style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: 'white', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back
          </button>
          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.65)', marginBottom: '4px', fontWeight: '500', letterSpacing: '.05em' }}>HARDWARE ORDER DETAIL</div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: 'white' }}>Hardware # : {order.hardware_no || '—'}</h1>
            {order.est_no && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>Est # {order.est_no}</div>}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{ background: 'white', borderBottom: '1px solid #f3f4f6', padding: '0 32px', animation: 'fadeSlideIn .4s ease .05s both' }}>
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {statusSteps.map(step => {
            const isActive = step === currentStatus;
            const sc = statusColors[step] || statusColors.Voided;
            return (
              <div key={step} style={{ padding: '14px 28px', fontSize: '13px', fontWeight: isActive ? '700' : '500', color: isActive ? sc.active : '#9ca3af', borderBottom: isActive ? `3px solid ${sc.active}` : '3px solid transparent', background: isActive ? sc.light : 'transparent', cursor: 'default', whiteSpace: 'nowrap', transition: 'all .2s' }}>
                {isActive && <span style={{ width: 8, height: 8, borderRadius: '50%', background: sc.active, display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />}
                {step}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '28px 32px', animation: 'fadeSlideIn .4s ease .1s both' }}>

        {/* ── INFO CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Order Date',  value: order.order_date ? order.order_date.substring(0,10) : '—', icon: '📅' },
            { label: 'Ship Date',   value: order.ship_date  ? order.ship_date.substring(0,10)  : '—', icon: '🚚' },
            { label: 'Invoice No#', value: order.invoice_no  || '—', icon: '🧾' },
            { label: 'Location',    value: order.location    || '—', icon: '📍' },
            { label: 'Assigned To', value: order.assigned_user_name || order.assigned_username || '—', icon: '👤' },
          ].map((info, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>{info.icon}</span>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '.06em' }}>{info.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginTop: '2px' }}>{info.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── COMMENTS ── */}
        <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,.06)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>💬 Comments</h3>
          <div style={{ minHeight: '60px', padding: '14px 18px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6', fontSize: '14px', color: order.remark ? '#374151' : '#d1d5db', lineHeight: '1.6' }}>
            {order.remark || order.comment || <em>No comments added.</em>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
            <span>Created By: {order.assigned_user_name || order.assigned_username || '—'}</span>
            <span>Updated By: —</span>
          </div>
        </div>

        {/* ── ORDER TRACKING TABLE ── */}
        <div style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>📦 Order Tracking</h3>
            <span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
              Items
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '920px' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '2px solid #f3f4f6' }}>
                  {['Line', 'Product Type', 'Part Number', 'Mfg. Name', 'Description', 'QTY', 'Serial No.', 'Action'].map((h, i) => (
                    <th key={i} style={{ padding: '13px 18px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>

                {/* ── ROW 1: Main order line ── */}
                {(() => {
                  const ptC = ptColor(order.product_type);
                  return (
                    <tr style={{ borderBottom: '2px solid #d1fae5', background: '#f0fdf9' }}>
                      <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '700', color: '#065f46' }}>1</td>
                      <td style={{ padding: '14px 18px' }}>
                        {order.product_type
                          ? <span style={{ background: ptC.bg, color: ptC.color, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>{order.product_type}</span>
                          : <span style={{ color: '#e5e7eb' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', fontFamily: 'monospace', color: '#374151' }}>
                        {order.part_number || <span style={{ color: '#e5e7eb', fontFamily: 'sans-serif' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                        {order.manufacturer_name || <span style={{ color: '#e5e7eb' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: '#6b7280', maxWidth: '260px' }}>
  {order.manufacturer_name?.toLowerCase() === 'other'
    ? (order.special_request
        ? <div style={{ lineHeight: '1.5', whiteSpace: 'normal', wordBreak: 'break-word' }}>{order.special_request}</div>
        : <span style={{ color: '#e5e7eb' }}>—</span>)
    : (getDescription(order.part_number, order.manufacturer_name, order.product_type)
        ? <div style={{ lineHeight: '1.5', whiteSpace: 'normal', wordBreak: 'break-word' }}>{getDescription(order.part_number, order.manufacturer_name, order.product_type)}</div>
        : <span style={{ color: '#e5e7eb' }}>—</span>)
  }
</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        {order.qty
                          ? <span style={{ background: '#f0fdf4', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid #bbf7d0' }}>{order.qty}</span>
                          : <span style={{ color: '#e5e7eb' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', fontFamily: 'monospace', color: '#374151' }}>
                        {order.serial_number || <span style={{ color: '#e5e7eb', fontFamily: 'sans-serif' }}>—</span>}
                      </td>
                      {(() => {
  const key  = getKey(null, 1);
  const hasW = !!warranties[key];
  return (
    <td style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button className="hw-btn" onClick={() => openAddWarranty(null, 1)}
          style={{ padding: '5px 16px', background: hasW ? '#0f766e' : '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', minWidth: '74px' }}>
          {hasW ? 'Update' : 'Add'}
        </button>
        {hasW && (
          <button className="hw-btn" onClick={() => openViewWarranty(null, 1)}
            style={{ padding: '5px 16px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', minWidth: '74px' }}>
            View
          </button>
        )}
      </div>
    </td>
  );
})()}
                    </tr>
                  );
                })()}

                {/* ── Inline item rows ── */}
                {items.map((item, i) => {
                  const lineNo     = i + 2;
                  const key        = getKey(item, lineNo);
                  const hasW       = !!warranties[key];
                  const isServices = (item.productType || item.product_type || '').toLowerCase() === 'services';
                  const mfgName    = item.manufacturerName || item.manufacturer_name || '—';
                  const partNum    = item.partNumber || item.part_number || '';
                  const serialNo   = item.serialNumber || item.serial_number || '';
                  const qty        = item.qty || '';
                  const prodType   = item.productType || item.product_type || '';
                  const ptC2       = ptColor(prodType);
                  const desc       = getDescription(partNum, mfgName, prodType);

                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#f9fafb' }}>
                      <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '700', color: '#6b7280' }}>{lineNo}</td>
                      <td style={{ padding: '14px 18px' }}>
                        {prodType ? <span style={{ background: ptC2.bg, color: ptC2.color, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>{prodType}</span> : <span style={{ color: '#e5e7eb' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', fontFamily: 'monospace', color: '#374151' }}>
                        {partNum || <span style={{ color: '#e5e7eb', fontFamily: 'sans-serif' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>{mfgName}</td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: '#6b7280', maxWidth: '260px' }}>
  {(item.manufacturerName || item.manufacturer_name)?.toLowerCase() === 'other'
    ? ((item.specialRequest || item.special_request)
        ? <div style={{ lineHeight: '1.5', whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.specialRequest || item.special_request}</div>
        : <span style={{ color: '#e5e7eb' }}>—</span>)
    : (desc
        ? <div style={{ lineHeight: '1.5', whiteSpace: 'normal', wordBreak: 'break-word' }}>{desc}</div>
        : <span style={{ color: '#e5e7eb' }}>—</span>)
  }
</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        {!isServices && qty ? <span style={{ background: '#f0fdf4', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', border: '1px solid #bbf7d0' }}>{qty}</span> : <span style={{ color: '#e5e7eb' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '13px', fontFamily: 'monospace', color: '#374151' }}>
                        {serialNo || <span style={{ color: '#e5e7eb', fontFamily: 'sans-serif' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <button className="hw-btn" onClick={() => openAddWarranty(item, lineNo)}
                            style={{ padding: '5px 16px', background: hasW ? '#0f766e' : '#1d4ed8', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', minWidth: '74px' }}>
                            {hasW ? 'Update' : 'Add'}
                          </button>
                          {hasW && (
                            <button className="hw-btn" onClick={() => openViewWarranty(item, lineNo)}
                              style={{ padding: '5px 16px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', minWidth: '74px' }}>
                              View
                            </button>
                          )}
                          <button className="hw-btn"
                            onClick={() => { setTicketModal({ open: true, item: item, lineNo: lineNo }); setTicketForm({ email: '', comment: '', image: null }); }}
                            style={{ padding: '5px 16px', background: 'linear-gradient(135deg,#be185d,#ec4899)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', minWidth: '74px' }}>
                            Ticket
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>

          {/* POD Files */}

<PodFilesSection order={order} orderType="hardware" setSelectedOrder={setSelectedHardwareOrder} />
        </div>
      </div>

      {/* ADD/UPDATE WARRANTY MODAL */}
      {warrantyModal.open && warrantyModal.mode === 'add' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '560px', margin: '0 16px', boxShadow: '0 24px 64px rgba(0,0,0,.25)', overflow: 'hidden', animation: 'fadeSlideIn .25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1f2937' }}>
                {warranties[getKey(warrantyModal.item, warrantyModal.lineNo)] ? 'Update Warranty' : 'Add Warranty'}
              </h3>
              <button onClick={() => setWarrantyModal({ open: false, mode: '', item: null, lineNo: null })}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af' }}>×</button>
            </div>
            <div style={{ padding: '28px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Serial Number', key: 'serialNumber', type: 'text', placeholder: 'e.g. SN-123456' },
                  { label: 'Product Name',  key: 'productName',  type: 'text', placeholder: 'e.g. LG 27 inch Monitor' },
                  { label: 'Purchase Date', key: 'purchaseDate', type: 'date', placeholder: '' },
                  { label: 'Expiry Date',   key: 'expiryDate',   type: 'date', placeholder: '' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={warrantyForm[key]}
                      onChange={e => setWarrantyForm(f => ({ ...f, [key]: e.target.value }))}
                      style={inputStyle} onFocus={focusGreen} onBlur={blurGray} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#fafafa' }}>
              <button onClick={() => setWarrantyModal({ open: false, mode: '', item: null, lineNo: null })}
                style={{ padding: '9px 22px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: 'white', color: '#374151', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Close
              </button>
              <button onClick={handleSaveWarranty}
                style={{ padding: '9px 22px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg,#0f766e,#059669)', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                {warranties[getKey(warrantyModal.item, warrantyModal.lineNo)] ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW WARRANTY MODAL */}
      {warrantyModal.open && warrantyModal.mode === 'view' && (() => {
        const key    = getKey(warrantyModal.item, warrantyModal.lineNo);
        const w      = warranties[key];
        if (!w) return null;
        const today  = new Date();
        const expiry = w.expiryDate ? new Date(w.expiryDate) : null;
        const isActive = expiry && expiry >= today;
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', margin: '0 16px', boxShadow: '0 24px 64px rgba(0,0,0,.25)', overflow: 'hidden', animation: 'fadeSlideIn .25s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1f2937' }}>Warranty Information</h3>
                <button onClick={() => setWarrantyModal({ open: false, mode: '', item: null, lineNo: null })}
                  style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af' }}>×</button>
              </div>
              <div style={{ padding: '28px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#374151' }}>
                  {[
                    { label: 'Serial Number',       value: w.serialNumber },
                    { label: 'Product Name',         value: w.productName  },
                    { label: 'Purchase Date',        value: w.purchaseDate },
                    { label: 'Warranty Expiry Date', value: w.expiryDate   },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontWeight: '700', minWidth: '160px', color: '#374151' }}>{label}:</span>
                      <span style={{ color: value ? '#374151' : '#d1d5db' }}>{value || '—'}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', minWidth: '160px', color: '#374151' }}>Status:</span>
                    <span style={{ background: isActive ? '#d1fae5' : '#fef2f2', color: isActive ? '#065f46' : '#991b1b', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                      {isActive ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  {expiry && (
                    <div style={{ background: isActive ? '#f0fdf4' : '#fef2f2', border: `1px solid ${isActive ? '#bbf7d0' : '#fca5a5'}`, borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: isActive ? '#15803d' : '#991b1b', lineHeight: '1.6' }}>
                      {isActive
                        ? `✅ Your product is under warranty until ${w.expiryDate}. For technical assistance or service, please contact our support team.`
                        : `❌ Your warranty expired on ${w.expiryDate}. Please contact us for post-warranty support options.`}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#fafafa' }}>
                <button onClick={() => setWarrantyModal({ open: false, mode: '', item: null, lineNo: null })}
                  style={{ padding: '9px 22px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: 'white', color: '#374151', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Close
                </button>
                <button onClick={() => {
                    const ci = warrantyModal.item;
                    const cl = warrantyModal.lineNo;
                    setWarrantyModal({ open: false, mode: '', item: null, lineNo: null });
                    setTicketModal({ open: true, item: ci, lineNo: cl });
                    setTicketForm({ email: '', comment: '', image: null });
                  }}
                  style={{ padding: '9px 22px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg,#1e3a5f,#2d5a9e)', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                  Ticket
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CREATE TICKET MODAL */}
      {ticketModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', margin: '0 16px', boxShadow: '0 24px 64px rgba(0,0,0,.25)', overflow: 'hidden', animation: 'fadeSlideIn .25s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1f2937' }}>Create Ticket</h3>
              <button onClick={() => setTicketModal({ open: false, item: null, lineNo: null })}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af' }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Upload Image</label>
                <div style={{ border: '1.5px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                  <label style={{ background: '#f3f4f6', padding: '8px 14px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Choose File
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => setTicketForm(f => ({ ...f, image: e.target.files[0] }))} />
                  </label>
                  <span style={{ padding: '8px 14px', fontSize: '13px', color: '#9ca3af' }}>
                    {ticketForm.image ? ticketForm.image.name : 'No file chosen'}
                  </span>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Your Email</label>
                <input type="email" placeholder="Enter email" value={ticketForm.email}
                  onChange={e => setTicketForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle} onFocus={focusGreen} onBlur={blurGray} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Comment</label>
                <textarea placeholder="Enter comment" value={ticketForm.comment}
                  onChange={e => setTicketForm(f => ({ ...f, comment: e.target.value }))}
                  rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={focusGreen} onBlur={blurGray} />
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#fafafa' }}>
              <button onClick={() => setTicketModal({ open: false, item: null, lineNo: null })}
                style={{ padding: '9px 22px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: 'white', color: '#374151', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Close
              </button>
             <button onClick={async () => {
  try {
    const formData = new FormData();
    formData.append('orderId',   order.id || order.hardware_id || order.hardware_no);
    formData.append('orderType', 'hardware');
    formData.append('lineNo',    ticketModal.lineNo);
    formData.append('itemId',    ticketModal.item?.id || '');
    formData.append('email',     ticketForm.email);
    formData.append('comment',   ticketForm.comment);
    if (ticketForm.image) formData.append('image', ticketForm.image); // ✅ image add

    // ✅ Send item details for email
    formData.append('productType',      ticketModal.item?.product_type      || ticketModal.item?.productType      || order.product_type      || '');
    formData.append('partNumber',       ticketModal.item?.part_number        || ticketModal.item?.partNumber        || order.part_number        || '');
    formData.append('manufacturerName', ticketModal.item?.manufacturer_name  || ticketModal.item?.manufacturerName  || order.manufacturer_name  || '');
    formData.append('serialNumber',     ticketModal.item?.serial_number      || ticketModal.item?.serialNumber      || order.serial_number      || '');
    formData.append('qty',              ticketModal.item?.qty                 || order.qty                          || '');

    // ✅ Description logic (same as ITAR)
    const isOther = (ticketModal.item?.manufacturer_name || ticketModal.item?.manufacturerName || order.manufacturer_name || '').toLowerCase() === 'other';
    const desc = isOther
      ? (ticketModal.item?.special_request || ticketModal.item?.specialRequest || order.special_request || '')
      : getDescription(
          ticketModal.item?.part_number    || ticketModal.item?.partNumber    || order.part_number,
          ticketModal.item?.manufacturer_name || ticketModal.item?.manufacturerName || order.manufacturer_name,
          ticketModal.item?.product_type   || ticketModal.item?.productType   || order.product_type
        );
    formData.append('description', desc || '');


    const res = await fetch('http://localhost:8081/tickets', {
      method: 'POST',
      body: formData, // ✅ Content-Type automatically set hoga
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed');
    alert(`✅ Ticket created for Line ${ticketModal.lineNo}!`);
    setTicketModal({ open: false, item: null, lineNo: null });
    setTicketForm({ email: '', comment: '', image: null });

  } catch (err) {
    alert('❌ Failed: ' + err.message);
  }
}}
                style={{ padding: '9px 22px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg,#0f766e,#059669)', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px rgba(15,118,110,.3)' }}>
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
})()}

          {activeOrdersPage === "hardware-orders-report" && (
            <div>
              <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>Hardware Orders - Report</h1>
              <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid #e0e0e0" }}>
                  <button onClick={() => setHardwareReportFilters({...hardwareReportFilters, reportType: 'location'})} style={{ padding: "12px 24px", background: hardwareReportFilters.reportType === 'location' ? "#2c3e50" : "transparent", color: hardwareReportFilters.reportType === 'location' ? "white" : "#666", border: "none", borderBottom: hardwareReportFilters.reportType === 'location' ? "3px solid #2c3e50" : "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>🌍 HARDWARE ORDER REPORT LOCATION WISE</button>
                  <button onClick={() => setHardwareReportFilters({...hardwareReportFilters, reportType: 'product'})} style={{ padding: "12px 24px", background: hardwareReportFilters.reportType === 'product' ? "#2c3e50" : "transparent", color: hardwareReportFilters.reportType === 'product' ? "white" : "#666", border: "none", borderBottom: hardwareReportFilters.reportType === 'product' ? "3px solid #2c3e50" : "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>📋 HARDWARE ORDER REPORT PRODUCT TYPE</button>
                </div>

                {hardwareReportFilters.reportType === 'location' ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Status</label>
                      <select value={hardwareReportFilters.orderStatus} onChange={(e) => setHardwareReportFilters({...hardwareReportFilters, orderStatus: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select order status</option>
                        <option value="Backorder">Backorder</option>
                        <option value="Open">Open</option>
                        <option value="Completed">Completed</option>
                        <option value="Voided">Voided</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Location</label>
                      <select value={hardwareReportFilters.location} onChange={(e) => setHardwareReportFilters({...hardwareReportFilters, location: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select Location</option>
                        <option value="Pickering">Pickering</option>
                        <option value="gdfgfd">gdfgfd</option>
                        <option value="dfgdfg">dfgdfg</option>
                        <option value="ghryh">ghryh</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Product Type</label>
                      <select value={hardwareReportFilters.productType} onChange={(e) => setHardwareReportFilters({...hardwareReportFilters, productType: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select a option</option>
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="services">Services</option>
                        
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Manufacturer Name</label>
                      <select value={hardwareReportFilters.manufacturerName} onChange={(e) => setHardwareReportFilters({...hardwareReportFilters, manufacturerName: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select Manufacturer Name</option>
{manufacturers.map((m) => (
  <option key={m.id} value={m.name}>{m.name}</option>
))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Part Number</label>
                      <select value={hardwareReportFilters.partNumber} onChange={(e) => setHardwareReportFilters({...hardwareReportFilters, partNumber: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
  <option value="">Select</option>
  {products
    .filter(p => p.product_type === hardwareReportFilters.productType?.toLowerCase() && p.part_number)
    .map((p, i) => (
      <option key={i} value={p.part_number}>{p.part_number}</option>
    ))
  }
</select>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                  <button type="button" onClick={() => {
                    const orders = getFilteredHardwareReportOrders();
                    if (orders.length === 0) { alert("❌ No data to copy!"); return; }
                    const headers = "Hardware No#\tInvoice No#\tOrder Date\tShip Date\tStatus\tLocation\tProduct Type\tManufacturer Name\tPart No";
                    const rows = orders.map(o => `${o.hardware_no||''}\t${o.invoice_no||''}\t${formatDate(o.order_date)}\t${formatDate(o.ship_date)}\t${o.order_status||''}\t${o.location||''}\t${o.product_type||''}\t${o.manufacturer_name||''}\t${o.part_number||''}`).join('\n');
                    navigator.clipboard.writeText(headers + '\n' + rows).then(() => alert('✅ Copied!')).catch(() => alert('❌ Copy failed!'));
                  }} style={{ padding: "8px 16px", background: "#ff6b35", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Copy</button>

                  <button type="button" onClick={() => {
                    const orders = getFilteredHardwareReportOrders();
                    if (orders.length === 0) { alert("❌ No data!"); return; }
                    const headers = ['Hardware No#','Invoice No#','Order Date','Ship Date','Status','Location','Product Type','Manufacturer Name','Part No'];
                    const rows = orders.map(o => [o.hardware_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.product_type||'', o.manufacturer_name||'', o.part_number||'']);
                    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'hardware_orders_report.csv'; a.click();
                    URL.revokeObjectURL(url);
                  }} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>CSV</button>

                  <button type="button" onClick={() => {
                    const orders = getFilteredHardwareReportOrders();
                    if (orders.length === 0) { alert("❌ No data!"); return; }
                    const wsData = [
                      ['Hardware No#','Invoice No#','Order Date','Ship Date','Status','Location','Product Type','Manufacturer Name','Part No'],
                      ...orders.map(o => [o.hardware_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.product_type||'', o.manufacturer_name||'', o.part_number||''])
                    ];
                    const ws = XLSX.utils.aoa_to_sheet(wsData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Hardware Orders');
                    XLSX.writeFile(wb, 'hardware_orders_report.xlsx');
                  }} style={{ padding: "8px 16px", background: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Excel</button>

                  <button type="button" onClick={() => {
                    const orders = getFilteredHardwareReportOrders();
                    if (orders.length === 0) { alert("❌ No data!"); return; }
                    const rows = orders.map(o => `<tr><td>${o.hardware_no||''}</td><td>${o.invoice_no||''}</td><td>${formatDate(o.order_date)}</td><td>${formatDate(o.ship_date)}</td><td>${o.order_status||''}</td><td>${o.location||''}</td><td>${o.product_type||''}</td><td>${o.manufacturer_name||''}</td><td>${o.part_number||''}</td></tr>`).join('');
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`<html><head><title>Hardware Orders Report</title><style>body{font-family:Arial,sans-serif;font-size:12px;margin:20px}table{width:100%;border-collapse:collapse}th{background:#2c3e50;color:white;padding:8px;text-align:left;font-size:11px}td{border:1px solid #ddd;padding:8px;font-size:11px}tr:nth-child(even){background:#f2f2f2}</style></head><body><h2>Hardware Orders Report</h2><p>Total: ${orders.length}</p><table><thead><tr><th>Hardware No#</th><th>Invoice No#</th><th>Order Date</th><th>Ship Date</th><th>Status</th><th>Location</th><th>Product Type</th><th>Manufacturer</th><th>Part No</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
                    printWindow.document.close(); printWindow.focus(); printWindow.print();
                  }} style={{ padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Print</button>

                  <button type="button" onClick={() => {
                    const orders = getFilteredHardwareReportOrders();
                    if (orders.length === 0) { alert("❌ No data!"); return; }
                    const doc = new jsPDF({ orientation: 'landscape' });
                    doc.setFontSize(14); doc.text('Hardware Orders Report', 14, 15);
                    autoTable(doc, {
                      head: [['Hardware No#','Invoice No#','Order Date','Ship Date','Status','Location','Product Type','Manufacturer','Part No']],
                      body: orders.map(o => [o.hardware_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.product_type||'', o.manufacturer_name||'', o.part_number||'']),
                      startY: 28, styles: { fontSize: 8 }, headStyles: { fillColor: [44, 62, 80] }
                    });
                    doc.save('hardware_orders_report.pdf');
                  }} style={{ padding: "8px 16px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>PDF</button>

                  <div style={{ marginLeft: "auto" }}>
                    <input type="text" placeholder="Search:" style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" }} />
                  </div>
                </div>

                {getFilteredHardwareReportOrders().length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No orders found matching the selected filters</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Hardware No#</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Invoice No#</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Order Date</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Ship Date</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Status</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Location</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Product Type</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Manufacturer Name</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Part No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* FIX: was order.hardwareNo, order.invoiceNo, order.orderDate etc. */}
                        {getFilteredHardwareReportOrders().map((order) => (
                          <tr key={order.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.hardware_no}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.invoice_no}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{formatDate(order.order_date)}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{formatDate(order.ship_date)}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.order_status}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.location}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.product_type}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.manufacturer_name}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.part_number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>
                      Showing 1 to {getFilteredHardwareReportOrders().length} of {getFilteredHardwareReportOrders().length} entries
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

         {activeOrdersPage === "av-pos-create" && (
  <div>
    <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>{editingAvPosOrderId ? 'AV Pos - Edit' : 'AV Pos - Create'}</h1>
    <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>

      {/* Order Date + Est # */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Date /y *</label>
          <input type="date" value={avPosOrderForm.orderDate}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, orderDate: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Est # *</label>
          <input type="text" value={avPosOrderForm.estNo}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, estNo: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      </div>

      {/* Product Type + User + Manufacturer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Product Type *</label>
          <select value={avPosOrderForm.productType}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, productType: e.target.value, partNumber: '', manufacturerName: '', specialRequest: ''})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
            <option value="">Select Product Type</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="services">Services</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select A Project  Manager</label>
          <select value={avPosOrderForm.userId}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, userId: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
            <option value="">Select A Project  Manager</option>
            {data.map((profile) => (
              <option key={profile.id} value={profile.id}>{profile.name} ({profile.username})</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Manufacturer Name *</label>
          <select value={avPosOrderForm.manufacturerName}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, manufacturerName: e.target.value, partNumber: '', specialRequest: ''})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
            <option value="">Select Manufacturer Name</option>
            {manufacturers.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

     {/* Part Number + QTY + SN — single row */}
{(() => {
  const isOther = avPosOrderForm.manufacturerName?.toLowerCase() === 'other';
  const isServices = avPosOrderForm.productType === 'services';
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "flex-end" }}>

      {/* Part Number / Special Request */}
      <div style={{ width: "400px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>
          {isOther ? "Special Request" : "Select Part Number"}
        </label>
        {isOther ? (
          <input type="text"
            value={avPosOrderForm.specialRequest || ''}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, specialRequest: e.target.value})}
            placeholder="Enter special request..."
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        ) : (
          <select value={avPosOrderForm.partNumber}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, partNumber: e.target.value})}
            disabled={!avPosOrderForm.productType}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
            <option value="">
              {!avPosOrderForm.productType ? "Select Product Type first" : "Select Part Number"}
            </option>
            {getItarPartByType(avPosOrderForm.productType, avPosOrderForm.manufacturerName)
              .map((partNum, i) => (
                <option key={i} value={partNum}>{partNum}</option>
              ))
            }
          </select>
        )}
      </div>

      {/* QTY */}
      {!isServices && (
        <div style={{ width: "200px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>QTY # *</label>
          <input type="number" value={avPosOrderForm.qty}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, qty: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      )}

      {/* S.N. */}
      {!isOther && (
        <div style={{ width: "260px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>S.N. # *</label>
          <input type="text" value={avPosOrderForm.serialNumber}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, serialNumber: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      )}

    </div>
  );
})()}

      {/* Inline Item Rows */}
      <div style={{ marginBottom: "28px" }}>
        {avPosItemRows.map((row, idx) => {
          const isOtherRow = row.manufacturerName?.toLowerCase() === 'other';
          const isServicesRow = row.productType === 'services';
          return (
            <div key={row.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>

              {/* Product Type */}
              <div style={{ position: "relative", flex: 1.2, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
                  {idx === 0 ? "Select Product Type" : "Type Of Product"}
                </span>
                <select value={row.productType}
                  onChange={e => {
                    updateAvPosRow(row.id, "productType", e.target.value);
                    updateAvPosRow(row.id, "manufacturerName", "");
                    updateAvPosRow(row.id, "partNumber", "");
                  }}
                  style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
                  <option value=""></option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="services">Services</option>
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
              </div>

              {/* Manufacturer */}
              <div style={{ position: "relative", flex: 1.2, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
                  {idx === 0 ? "Select Manufacturer Name" : "Manufacturer Name"}
                </span>
                <select value={row.manufacturerName}
                  onChange={e => {
                    updateAvPosRow(row.id, "manufacturerName", e.target.value);
                    updateAvPosRow(row.id, "partNumber", "");
                  }}
                  style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
                  <option value="">Select Manufacturer Name</option>
                  {manufacturers.map((m) => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
              </div>

              {/* Part Number */}
              <div style={{ position: "relative", flex: 1.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
                  {idx === 0 ? "Select Part Number" : "Part Number"}
                </span>
                {isOtherRow ? (
                  <input type="text" value={row.specialRequest || ''}
                    onChange={e => updateAvPosRow(row.id, "specialRequest", e.target.value)}
                    placeholder="Enter special request..."
                    style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
                ) : (
                  <select value={row.partNumber}
                    onChange={e => updateAvPosRow(row.id, "partNumber", e.target.value)}
                    disabled={!row.productType}
                    style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
                    <option value=""></option>
                    {getItarPartByType(row.productType, row.manufacturerName)
  .map((partNum, i) => (
    <option key={i} value={partNum}>{partNum}</option>
  ))
}
                  </select>
                )}
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
              </div>

              {/* QTY */}
              {!isServicesRow && (
                <div style={{ position: "relative", flex: 0.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                  <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", zIndex: 1 }}>
                    {idx === 0 ? "QTY #" : "QTY#"}
                  </span>
                  <input type="number" min="1" value={row.qty}
                    onChange={e => updateAvPosRow(row.id, "qty", e.target.value)}
                    style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
                </div>
              )}

              {/* SN */}
              {!isOtherRow && (
                <div style={{ position: "relative", flex: 0.7, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
                  <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", zIndex: 1 }}>
                    {idx === 0 ? "S.N. #" : "S.N.#"}
                  </span>
                  <input type="text" value={row.serialNumber}
                    onChange={e => updateAvPosRow(row.id, "serialNumber", e.target.value)}
                    style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
                </div>
              )}

              {/* Remove Button */}
              <button onClick={() => removeAvPosRow(row.id)}
                style={{ width: "34px", height: "34px", flexShrink: 0, borderRadius: "50%", background: "#1a2a4a", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✕
              </button>
            </div>
          );
        })}

        {/* Add Row Button */}
        <button onClick={addAvPosRow}
          style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#4a5568", color: "#fff", border: "none", cursor: "pointer", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
          ＋
        </button>
      </div>

      {/* Location + AV Pos # */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Location *</label>
          <input type="text" value={avPosOrderForm.location}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, location: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>AV Pos # (PO#) *</label>
          <input type="text" value={avPosOrderForm.avPosNo}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, avPosNo: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      </div>

      {/* SOW */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>SOW (Scope of Work)</label>
        <textarea value={avPosOrderForm.sow}
          onChange={(e) => setAvPosOrderForm({...avPosOrderForm, sow: e.target.value})}
          rows="3"
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", resize: "vertical" }}
          placeholder="Enter scope of work details..." />
      </div>

      {/* Choose Files */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>
          Choose Files (POD)
        </label>

        {/* Edit mode — existing files show karo */}
        {editingAvPosOrderId && (() => {
          const editingOrder = avPosOrders.find(o => o.id === editingAvPosOrderId);
          const existingFiles = editingOrder?.pod_files || [];
          if (existingFiles.length === 0) return null;
          return (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Already Uploaded Files:
              </div>
              {existingFiles.map((file, fi) => (
                <div key={file.id || fi} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px" }}>
                  <span style={{ fontSize: "14px" }}>📎</span>
                  <span style={{ fontSize: "13px", color: "#374151", flex: 1 }}>
                    {file.original_name || file.filename}
                  </span>
                  <a
                    href={`http://localhost:8081/uploads/${file.filename}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "12px", color: "#059669", fontWeight: "600", textDecoration: "none" }}
                  >
                    👁️ View
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
  if (!window.confirm(`POD File ${fi + 1} delete karna chahte ho?`)) return;
  try {
    await axios.delete(`http://localhost:8081/orders/avpos/pod-files/${file.id}`);
    
    // ✅ Step 1: avPosOrders refresh karo aur wait karo
    await fetchAvPosOrders();
    setAvPosFileRefreshKey(prev => prev + 1);
    
    // ✅ Step 2: selectedAvPosOrder ko fresh pod_files se update karo
    const freshFilesRes = await axios.get(`http://localhost:8081/orders/avpos/${selectedAvPosOrder.id}/pod-files`);
    setSelectedAvPosOrder(prev => ({
      ...prev,
      pod_files: freshFilesRes.data
    }));
    
  } catch (err) {
    alert('❌ Delete failed: ' + err.message);
  }
}}
                    style={{ fontSize: "12px", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "3px 8px", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Nayi files add karne ke inputs */}
        {editingAvPosOrderId && (
          <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Add New Files:
          </div>
        )}
        {avPosFileInputs.map((fileInput, index) => (
          <div key={fileInput.id} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: index < avPosFileInputs.length - 1 ? "10px" : "0" }}>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setAvPosSelectedFiles(prev => {
                  const filtered = prev.filter(f => f.inputId !== fileInput.id);
                  return [...filtered, { inputId: fileInput.id, file }];
                });
              }}
              style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", background: "white" }}
            />
            {index === 0 ? (
              <button type="button" onClick={handleAddAvPosFile}
                style={{ padding: "8px 24px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                Add
              </button>
            ) : (
              <button type="button" onClick={() => {
                handleRemoveAvPosFile(fileInput.id);
                setAvPosSelectedFiles(prev => prev.filter(f => f.inputId !== fileInput.id));
              }}
                style={{ padding: "8px 18px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                X
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Ship Date + Invoice # */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Ship Date /y *</label>
          <input type="date" value={avPosOrderForm.shipDate}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, shipDate: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Invoice # *</label>
          <input type="text" value={avPosOrderForm.invoiceNo}
            onChange={(e) => setAvPosOrderForm({...avPosOrderForm, invoiceNo: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      </div>

      {/* Order Status */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Status # *</label>
        <select value={avPosOrderForm.orderStatus}
          onChange={(e) => setAvPosOrderForm({...avPosOrderForm, orderStatus: e.target.value})}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
          <option value="">Select a order status</option>
          <option value="Backorder">Backorder</option>
          <option value="Open">Open</option>
          <option value="Completed">Completed</option>
          <option value="Voided">Voided</option>
        </select>
      </div>

      {/* Remark / Comment */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Remark / Comment</label>
        <textarea
          value={avPosOrderForm.remark || ''}
          onChange={(e) => setAvPosOrderForm({...avPosOrderForm, remark: e.target.value})}
          placeholder="Enter remark or comment..."
          rows={4}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={handleResetAvPosForm}
          style={{ background: "#6c757d", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
          Reset
        </button>
        <button onClick={handleSaveAvPosOrder}
          style={{ background: "#5cb85c", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
          💾 {editingAvPosOrderId ? 'Update Order' : 'Save Order'}
        </button>
      </div>

    </div>
  </div>
)}

          {activeOrdersPage === "av-pos-list" && (
  <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
    <style>{`
      .av-row:hover { box-shadow: -3px 0 0 #ec4899 !important; background: linear-gradient(90deg, #fdf2f8 0%, #fff8fc 100%) !important; }
    `}</style>

    <div style={{ background: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)", padding: "32px 32px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em", display: "inline-block", marginBottom: "10px" }}>ORDERS MANAGEMENT</span>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>AV POs</h1>
          <p style={{ margin: "6px 0 0", fontSize: "15px", color: "rgba(255,255,255,0.75)" }}>Manage all AV purchase orders</p>
        </div>
       {hasPermission('AV-Pos-Add') && (
  <button onClick={() => { setEditingAvPosOrderId(null); setAvPosOrderForm({ orderDate:'',estNo:'',productType:'',userId:'',manufacturerName:'',partNumber:'',qty:'',serialNumber:'',location:'',avPosNo:'',shipDate:'',invoiceNo:'',orderStatus:'',sow:'', remark:'' }); setActiveOrdersPage('av-pos-create'); }}
    style={{ background: "white", color: "#be185d", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
    <span style={{ fontSize: "18px" }}>+</span> New AV PO
  </button>
)}
      </div>
    </div>

    <div style={{ padding: "0 32px", marginTop: "-44px", position: "relative", zIndex: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {[
          { label: "Total POs", value: avPosOrders.length, icon: "📦", color: "#ec4899", light: "#fdf2f8" },
          { label: "Open", value: avPosOrders.filter(o => o.order_status === 'Open').length, icon: "🔓", color: "#f59e0b", light: "#fffbeb" },
          { label: "Completed", value: avPosOrders.filter(o => o.order_status === 'Completed').length, icon: "✅", color: "#10b981", light: "#ecfdf5" },
          { label: "Backorder", value: avPosOrders.filter(o => o.order_status === 'Backorder').length, icon: "⏳", color: "#ef4444", light: "#fef2f2" },
          { label: "Voided", value: avPosOrders.filter(o => o.order_status === 'Voided').length, icon: "📪", color: "#6b7280", light: "#f9fafb" },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ background: "white", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: stat.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: "30px", fontWeight: "800", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px", fontWeight: "500" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: "24px 32px 32px" }}>
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Show</span>
            <select value={entriesPerPage} onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setAvPosCurrentPage(1); }}
              style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "white" }}>
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
            </select>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>entries</span>
            <span style={{ marginLeft: "8px", background: "#fce7f3", color: "#9d174d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{filteredAvPosOrders.length} records</span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔍</span>
            <input type="text" placeholder="Search AV POs..." value={listSearchTerm} onChange={(e) => setListSearchTerm(e.target.value)}
              style={{ padding: "9px 14px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "13px", width: "240px", color: "#374151" }} />
          </div>
        </div>

        {filteredAvPosOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>No AV POs Yet</div>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "6px" }}>Create your first AV purchase order</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1600px" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                   {["#","(PO#)", "Assigned User", "Order Date", "Est #",  "Product Type", "Manufacturer", "SPLIT", "QTY", "Serial No#", "Location", "SOW", "Ship Date", "Invoice No#",  "Status", "Actions"].map((h, i) => (
  <th key={i} style={{ padding: "13px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
    {h === "SPLIT" ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "700", border: "1px solid #bfdbfe", display: "inline-block" }}>
          # Part No
        </span>
        <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "700", border: "1px solid #fcd34d", display: "inline-block" }}>
          ✦ Special Request
        </span>
      </div>
    ) : h}
  </th>
))}
                  </tr>
                </thead>
                <tbody>
                 {filteredAvPosOrders.slice(
  (avPosCurrentPage - 1) * entriesPerPage,
  avPosCurrentPage * entriesPerPage
).map((order, idx) => {
                    const name = order.assigned_user_name || order.assigned_username || '';
                    const initials = name ? name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : '?';
                    const avatarPalette = ['#ec4899','#3b82f6','#10b981','#f59e0b','#8b5cf6','#06b6d4'];
                    const avatarBg = avatarPalette[(order.id||idx) % avatarPalette.length];
                    const statusConfig = {
                      'Completed': { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7', dot: '#10b981' },
                      'Open': { bg: '#fffbeb', color: '#92400e', border: '#fcd34d', dot: '#f59e0b' },
                      'Backorder': { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5', dot: '#ef4444' },
                      'Voided': { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb', dot: '#9ca3af' },
                    };
                    const sc = statusConfig[order.order_status] || statusConfig['Voided'];
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="order-row av-row" style={{ borderBottom: "1px solid #f9fafb" }}>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#d1d5db", fontWeight: "600" }}>{String(idx+1).padStart(2,'0')}</td>
                          <td style={{ padding: "14px 16px" }}>
                           <span
  onClick={() => { setSelectedAvPosOrder(order); setActiveOrdersPage('av-pos-detail'); }}
  style={{ background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#9d174d", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
  {order.av_pos_no || '—'}
</span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            {name ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", flexShrink: 0, boxShadow: `0 2px 8px ${avatarBg}55` }}>{initials}</div>
                                <div>
                                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#1f2937" }}>{order.assigned_user_name || name}</div>
                                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>@{order.assigned_username}</div>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>👤</div>
                                <span style={{ fontSize: "12px", color: "#d1d5db" }}>Unassigned</span>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(order.order_date) || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{order.est_no || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.product_type || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.manufacturer_name || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px" }}>
  {order.manufacturer_name?.toLowerCase() === 'other' ? (
    order.special_request ? (
      <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #fcd34d" }}>
        ✦ {order.special_request}
      </span>
    ) : <span style={{color:"#e5e7eb"}}>—</span>
  ) : (
    order.part_number ? (
      <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #bfdbfe", fontFamily: "monospace" }}>
        # {order.part_number}
      </span>
    ) : <span style={{color:"#e5e7eb"}}>—</span>
  )}
</td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            {order.qty ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{order.qty}</span> : <span style={{color:"#e5e7eb"}}>—</span>}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "12px", fontFamily: "monospace", color: "#374151" }}>{order.serial_number || <span style={{color:"#e5e7eb",fontFamily:"sans-serif"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.location || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "12px", color: "#374151", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={order.sow||''}>{order.sow || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(order.ship_date) || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.invoice_no || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                              {order.order_status || '—'}
                            </span>
                          </td>
                         <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    {Array.isArray(order.items) && order.items.length > 0 ? (
      <button onClick={() => setExpandedAvPosOrderId(expandedAvPosOrderId === order.id ? null : order.id)}
        style={{ background: expandedAvPosOrderId === order.id ? "#fce7f3" : "#fdf2f8", color: "#9d174d", border: "1px solid #fbcfe8", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", minWidth: "44px", textAlign: "center" }}>
        {expandedAvPosOrderId === order.id ? "▲" : "▼"} {order.items.length}
      </button>
    ) : (
      <span style={{ minWidth: "44px", display: "inline-block" }} />
    )}

    {hasPermission('AV-Pos-Edit') && (
<button className="action-btn edit-btn" onClick={() => {
  const profile = data.find(p => p.username === order.assigned_username);
  setAvPosOrderForm({
    orderDate: order.order_date ? order.order_date.toString().split('T')[0] : '',
    estNo: order.est_no || '',
    productType: order.product_type || '',
    userId: profile ? String(profile.id) : '',
    manufacturerName: order.manufacturer_name || '',
    partNumber: order.part_number || '',
    specialRequest: order.special_request || '',
    qty: order.qty != null ? String(order.qty) : '',
    serialNumber: order.serial_number || '',
    location: order.location || '',
    avPosNo: order.av_pos_no || '',
    shipDate: order.ship_date ? order.ship_date.toString().split('T')[0] : '',
    invoiceNo: order.invoice_no || '',
    orderStatus: order.order_status || '',
    sow: order.sow || '',
    remark: order.remark || ''
  });
  setAvPosItemRows(Array.isArray(order.items) && order.items.length > 0 ? order.items : []);
  setEditingAvPosOrderId(order.id);
  setActiveOrdersPage('av-pos-create');
}}
  style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
  ✏️ Edit
</button>
)}

{hasPermission('AV-Pos-Delete') && (
<button className="action-btn del-btn" onClick={() => handleDeleteAvPosOrder(order.id)}
  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
  🗑️
</button>
)}
  </div>
</td>
                        </tr>
                        {expandedAvPosOrderId === order.id && Array.isArray(order.items) && order.items.length > 0 && (
                          <tr>
                            <td colSpan={16} style={{ padding: 0, background: "#fff5fb" }}>
                              <div style={{ padding: "14px 24px 18px 48px", borderBottom: "2px solid #fbcfe8", borderTop: "1px solid #fbcfe8" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#9d174d", letterSpacing: "0.05em" }}>📦 ITEM ROWS</span>
                                  <span style={{ background: "#fce7f3", color: "#9d174d", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{order.items.length} items</span>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                  <thead>
                                    <tr style={{ background: "#fce7f3" }}>
                                      {["#", "Product Type", "Manufacturer", "Part Number", "QTY", "Serial No."].map((h, i) => (
                                        <th key={i} style={{ padding: "8px 14px", textAlign: "left", color: "#9d174d", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #fbcfe8" }}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, i) => (
                                      <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fdf2f8", borderBottom: "1px solid #fce7f3" }}>
                                        <td style={{ padding: "8px 14px", color: "#9ca3af", fontWeight: "600" }}>{String(i+1).padStart(2,'0')}</td>
                                        <td style={{ padding: "8px 14px" }}>
                                          {item.productType ? <span style={{ background: "#fce7f3", color: "#9d174d", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>{item.productType}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
                                        </td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontWeight: "500" }}>{item.manufacturerName || <span style={{ color: "#e5e7eb" }}>—</span>}</td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontFamily: "monospace" }}>{item.partNumber || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}</td>
                                        <td style={{ padding: "8px 14px" }}>
                                          {item.qty ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{item.qty}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
                                        </td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontFamily: "monospace" }}>{item.serialNumber || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Showing <strong style={{color:"#1f2937"}}>{Math.min(entriesPerPage, filteredAvPosOrders.length)}</strong> of <strong style={{color:"#1f2937"}}>{filteredAvPosOrders.length}</strong> entries</span>
              <div style={{ display: "flex", gap: "4px" }}>
                {(() => {
  const total = Math.ceil(filteredAvPosOrders.length / entriesPerPage) || 1;
  return (
    <>
      <button onClick={() => setAvPosCurrentPage(p => Math.max(1, p-1))} disabled={avPosCurrentPage===1}
  style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"white", color: avPosCurrentPage===1?"#d1d5db":"#6b7280", cursor: avPosCurrentPage===1?"not-allowed":"pointer", fontSize:"13px" }}>
  ← Prev
</button>
{Array.from({length: total}, (_,i) => i+1).map(page => (
  <button key={page} onClick={() => setAvPosCurrentPage(page)}
    style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background: page===avPosCurrentPage?"linear-gradient(135deg,#be185d,#ec4899)":"white", color: page===avPosCurrentPage?"white":"#6b7280", cursor:"pointer", fontSize:"13px", fontWeight: page===avPosCurrentPage?"700":"400" }}>
    {page}
  </button>
))}
<button onClick={() => setAvPosCurrentPage(p => Math.min(total, p+1))} disabled={avPosCurrentPage===total}
  style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"white", color: avPosCurrentPage===total?"#d1d5db":"#6b7280", cursor: avPosCurrentPage===total?"not-allowed":"pointer", fontSize:"13px" }}>
  Next →
</button>
    </>
  );
})()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
          )}

{activeOrdersPage === "av-pos-detail" && selectedAvPosOrder && (() => {
  const order = selectedAvPosOrder;
  const getDescription = (partNumber, manufacturerName, productType) => {
  if (!partNumber) return '';
  const matched = products?.find(p => 
    p.part_number?.trim().toLowerCase() === partNumber?.trim().toLowerCase() &&
    p.manufacturer_name?.trim().toLowerCase() === manufacturerName?.trim().toLowerCase() &&
    p.product_type?.trim().toLowerCase() === productType?.trim().toLowerCase()
  );
  return matched?.product_description || '';
};
  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];
  

  const statusConfig = {
    'Open':      { active: '#f59e0b', light: '#fffbeb', border: '#fcd34d' },
    'Backorder': { active: '#ef4444', light: '#fef2f2', border: '#fca5a5' },
    'Completed': { active: '#10b981', light: '#ecfdf5', border: '#6ee7b7' },
    'Voided':    { active: '#6b7280', light: '#f9fafb', border: '#e5e7eb' },
  };
  const currentStatus = order.order_status || 'Open';
  const statusSteps = ['Open', 'Backorder', 'Completed', 'Voided'];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #be185d 0%, #ec4899 100%)", padding: "32px 32px 28px", position: "relative", overflow: "hidden", animation: "fadeSlideIn 0.4s ease" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <button
            onClick={() => setActiveOrdersPage('av-pos-list')}
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", marginBottom: "16px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Back
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "4px", fontWeight: "500", letterSpacing: "0.05em" }}>AV POS ORDER DETAIL</div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "white" }}>PO# : {order.av_pos_no || '—'}</h1>
              {order.est_no && <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>Est # {order.est_no}</div>}
            </div>
            <button
              onClick={() => {
                const profile = data.find(p => p.username === order.assigned_username);
              setAvPosOrderForm({
  orderDate: order.order_date ? order.order_date.substring(0, 10) : '',
  estNo: order.est_no || '',
  productType: order.product_type || '',
  userId: profile ? String(profile.id) : '',
  manufacturerName: order.manufacturer_name || '',
  partNumber: order.part_number || '',
  specialRequest: order.special_request || '',
  qty: order.qty != null ? String(order.qty) : '',
  serialNumber: order.serial_number || '',
  location: order.location || '',
  avPosNo: order.av_pos_no || '',
  shipDate: order.ship_date ? order.ship_date.substring(0, 10) : '',
  invoiceNo: order.invoice_no || '',
  orderStatus: order.order_status || '',
  sow: order.sow || '',
  remark: order.remark || ''
});
setAvPosItemRows(Array.isArray(order.items) && order.items.length > 0 ? order.items : []);
setEditingAvPosOrderId(order.id);
setActiveOrdersPage('av-pos-create');
              }}
              style={{ background: "white", color: "#be185d", border: "none", padding: "10px 22px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              ✏️ Edit Order
            </button>
          </div>
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={{ background: "white", borderBottom: "1px solid #f3f4f6", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {statusSteps.map((step) => {
            const isActive = step === currentStatus;
            const sc = statusConfig[step] || statusConfig['Voided'];
            return (
              <div key={step} style={{ padding: "14px 32px", fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isActive ? sc.active : "#9ca3af", borderBottom: isActive ? `3px solid ${sc.active}` : "3px solid transparent", background: isActive ? sc.light : "transparent", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                {isActive && (
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sc.active, display: "inline-block", marginRight: "8px", verticalAlign: "middle" }} />
                )}
                {step}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>

       {/* ── STATUS + COMMENTS 2-column ── */}
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
  
  {/* Status Card */}
  <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px" }}>
    <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>📋 Status</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ fontSize: "14px", color: "#374151" }}>
        <span style={{ fontWeight: "700", color: "#be185d" }}>PO # :</span> {order.av_pos_no || '—'}
      </div>
      <div style={{ fontSize: "14px", color: "#374151" }}>
        <span style={{ fontWeight: "700" }}>Invoice :</span> {order.invoice_no || '—'}
      </div>
      <div style={{ fontSize: "14px", color: "#374151" }}>
        <span style={{ fontWeight: "700" }}>Location :</span> {order.location || '—'}
      </div>
      <div style={{ fontSize: "14px", color: "#374151" }}>
        <span style={{ fontWeight: "700" }}>Order Date :</span> {order.order_date ? order.order_date.substring(0,10) : '—'}
      </div>
      <div style={{ fontSize: "14px", color: "#374151" }}>
        <span style={{ fontWeight: "700" }}>Ship Date :</span> {order.ship_date ? order.ship_date.substring(0,10) : '—'}
      </div>
      <div style={{ fontSize: "14px", color: "#374151" }}>
        <span style={{ fontWeight: "700" }}>Est # :</span> {order.est_no || '—'}
      </div>
    </div>
    <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9ca3af" }}>
      <span>Created By : {order.assigned_user_name || order.assigned_username || '—'}</span>
      <span>Updated By : —</span>
    </div>
  </div>

  {/* Comments Card */}
  <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px" }}>
    <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>💬 Comments</h3>
    <div style={{ minHeight: "80px", padding: "14px 18px", background: "#f9fafb", borderRadius: "10px", border: "1px solid #f3f4f6", fontSize: "14px", color: order.remark ? "#374151" : "#d1d5db", lineHeight: "1.7" }}>
      {order.remark || <em>No comments added.</em>}
    </div>
  </div>
</div>

{/* ── INFO CARDS — Product details ── */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
  {[
    { label: "Product Type", value: order.product_type || '—', icon: "📦" },
    { label: "Manufacturer",  value: order.manufacturer_name || '—', icon: "🏭" },
    { label: "Part No#",      value: order.part_number || '—', icon: "🔩" },
    { label: "QTY",           value: order.qty || '—', icon: "🔢" },
    { label: "Serial No#",    value: order.serial_number || '—', icon: "🏷️" },
    { label: "Assigned To",   value: order.assigned_user_name || order.assigned_username || '—', icon: "👤" },
  ].map((info, i) => (
    <div key={i} style={{ background: "white", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ fontSize: "22px" }}>{info.icon}</span>
      <div>
        <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>{info.label}</div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", marginTop: "2px" }}>{info.value}</div>
      </div>
    </div>
  ))}
</div>
        {/* SOW */}
        {order.sow && (
          <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>📋 Scope of Work (SOW)</h3>
            <div style={{ padding: "14px 18px", background: "#fdf2f8", borderRadius: "10px", border: "1px solid #fbcfe8", fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
              {order.sow}
            </div>
          </div>
        )}

        {/* ORDER TRACKING TABLE */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1f2937" }}>📦 Order Tracking</h3>
            <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
  Items
</span>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280" }}>No inline items in this order</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                    {["Line", "Product Type", "Part Number", "Manufacturer", "Description", "QTY", "Serial No."].map((h, i) => (
                      <th key={i} style={{ padding: "13px 18px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
  {/* ── Main Order Row ── */}
  <tr style={{ borderBottom: "2px solid #d1fae5", background: "#f0fdf9" }}>
  <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "700", color: "#065f46" }}>1</td>
  <td style={{ padding: "14px 18px" }}>
    {order.product_type ? (
      <span style={{
        background: order.product_type?.toLowerCase() === 'hardware' ? '#eff6ff' : order.product_type?.toLowerCase() === 'software' ? '#f0fdf4' : order.product_type?.toLowerCase() === 'services' ? '#fef3c7' : '#f5f3ff',
        color: order.product_type?.toLowerCase() === 'hardware' ? '#1d4ed8' : order.product_type?.toLowerCase() === 'software' ? '#15803d' : order.product_type?.toLowerCase() === 'services' ? '#92400e' : '#5b21b6',
        padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize"
      }}>{order.product_type}</span>
    ) : <span style={{ color: "#e5e7eb" }}>—</span>}
  </td>
  <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
    {order.part_number || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
  </td>
  <td style={{ padding: "14px 18px", fontSize: "13px", fontWeight: "600", color: "#374151" }}>
    {order.manufacturer_name || <span style={{ color: "#e5e7eb" }}>—</span>}
  </td>

  {/* ✅ Description td — FIXED */}
  <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280", maxWidth: "280px" }}>
  {order.manufacturer_name?.toLowerCase() === 'other'
    ? (order.special_request
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>{order.special_request}</div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
    : (getDescription(order.part_number, order.manufacturer_name, order.product_type)
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>
            {getDescription(order.part_number, order.manufacturer_name, order.product_type)}
          </div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
  }
</td>

  <td style={{ padding: "14px 18px", textAlign: "center" }}>
    {order.qty
      ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{order.qty}</span>
      : <span style={{ color: "#e5e7eb" }}>—</span>}
  </td>
  <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
    {order.serial_number || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
  </td>
</tr>

  {/* ── Inline Item Rows ── */}
  {items.map((item, i) => {
    const isServices = item.productType?.toLowerCase() === 'services' || item.product_type?.toLowerCase() === 'services';
    const mfgName    = item.manufacturerName || item.manufacturer_name || '—';
    const partNum    = item.partNumber || item.part_number || '';
    const serialNo   = item.serialNumber || item.serial_number || '';
    const qty        = item.qty || '';
    const prodType   = item.productType || item.product_type || '';
    const description = getDescription(
  item.partNumber || item.part_number,
  item.manufacturerName || item.manufacturer_name,
  item.productType || item.product_type
);
    const ptColors = {
      hardware: { bg: '#eff6ff', color: '#1d4ed8' },
      software: { bg: '#f0fdf4', color: '#15803d' },
      services: { bg: '#fef3c7', color: '#92400e' },
    };
    const ptC = ptColors[prodType?.toLowerCase()] || { bg: '#f5f3ff', color: '#5b21b6' };
    return (
      <tr key={i} style={{ borderBottom: "1px solid #f9fafb", background: i % 2 === 0 ? "white" : "#f9fafb" }}>
        <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "700", color: "#6b7280" }}>{i + 2}</td>
        <td style={{ padding: "14px 18px" }}>
          {prodType ? <span style={{ background: ptC.bg, color: ptC.color, padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" }}>{prodType}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
        </td>
        <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
          {partNum || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
        </td>
        <td style={{ padding: "14px 18px", fontSize: "13px", fontWeight: "600", color: "#374151" }}>{mfgName}</td>
        <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280", maxWidth: "280px" }}>
  {(item.manufacturerName || item.manufacturer_name)?.toLowerCase() === 'other'
    ? ((item.specialRequest || item.special_request)
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>{item.specialRequest || item.special_request}</div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
    : (description
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>{description}</div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
  }
</td>
        <td style={{ padding: "14px 18px", textAlign: "center" }}>
          {!isServices && qty ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{qty}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
        </td>
        <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
          {serialNo || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
        </td>
        <td style={{ padding: "14px 18px" }}></td>
      </tr>
    );
  })}
</tbody>
              </table>
            </div>
          )}

          {/* POD FILE SECTION */}
         
<PodFilesSection order={order} orderType="avpos" setSelectedOrder={setSelectedAvPosOrder} />
</div>
</div>
</div>
  );
})()}
       

          {activeOrdersPage === "av-pos-report" && (
            <div>
              <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>AV Pos - Report</h1>
              <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid #e0e0e0" }}>
                  <button onClick={() => setAvPosReportFilters({...avPosReportFilters, reportType: 'location'})} style={{ padding: "12px 24px", background: avPosReportFilters.reportType === 'location' ? "#2c5282" : "transparent", color: avPosReportFilters.reportType === 'location' ? "white" : "#666", border: "none", borderBottom: avPosReportFilters.reportType === 'location' ? "3px solid #2c5282" : "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>🌍 AVPOS REPORT LOCATION WISE</button>
                  <button onClick={() => setAvPosReportFilters({...avPosReportFilters, reportType: 'product'})} style={{ padding: "12px 24px", background: avPosReportFilters.reportType === 'product' ? "#2c5282" : "transparent", color: avPosReportFilters.reportType === 'product' ? "white" : "#666", border: "none", borderBottom: avPosReportFilters.reportType === 'product' ? "3px solid #2c5282" : "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>📦 AVPOS REPORT PRODUCT TYPE</button>
                </div>

                {avPosReportFilters.reportType === 'location' ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Status</label>
                      <select value={avPosReportFilters.orderStatus} onChange={(e) => setAvPosReportFilters({...avPosReportFilters, orderStatus: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select order status</option>
                        <option value="Backorder">Backorder</option>
                        <option value="Open">Open</option>
                        <option value="Completed">Completed</option>
                        <option value="Voided">Voided</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Location</label>
                      <select value={avPosReportFilters.location} onChange={(e) => setAvPosReportFilters({...avPosReportFilters, location: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select Location</option>
                        <option value="Pickering">Pickering</option>
                        <option value="Darlington">Darlington</option>
                        <option value="1675 MONTGOMERY (Building P05)">1675 MONTGOMERY (Building P05)</option>
                        <option value="DEC Building">DEC Building</option>
                        <option value="889 Brock Rd South">889 Brock Rd South</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Product Type</label>
                      <select value={avPosReportFilters.productType} onChange={(e) => setAvPosReportFilters({...avPosReportFilters, productType: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select a option</option>
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="services">Services</option>
                       
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Manufacturer Name</label>
                      <select value={avPosReportFilters.manufacturerName} onChange={(e) => setAvPosReportFilters({...avPosReportFilters, manufacturerName: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select Manufacturer Name</option>
{manufacturers.map((m) => (
  <option key={m.id} value={m.name}>{m.name}</option>
))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Part Number</label>
                      <select value={avPosReportFilters.partNumber} onChange={(e) => setAvPosReportFilters({...avPosReportFilters, partNumber: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
  <option value="">Select part number</option>
  {products
    .filter(p => p.product_type === avPosReportFilters.productType?.toLowerCase() && p.part_number)
    .map((p, i) => (
      <option key={i} value={p.part_number}>{p.part_number}</option>
    ))
  }
</select>
                    </div>
                  </div>
                )}

                {/* FIX: All export buttons now call getFilteredAvPosReportOrders() and use snake_case keys */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                  <button type="button" onClick={() => {
                    const orders = getFilteredAvPosReportOrders();
                    if (orders.length === 0) { alert("❌ No data to copy!"); return; }
                    const headers = "PO#\tInvoice No#\tOrder Date\tShip Date\tStatus\tLocation\tSOW";
                    const rows = orders.map(o => `${o.av_pos_no||''}\t${o.invoice_no||''}\t${formatDate(o.order_date)}\t${formatDate(o.ship_date)}\t${o.order_status||''}\t${o.location||''}\t${o.sow||''}`).join('\n');
                    navigator.clipboard.writeText(headers + '\n' + rows).then(() => alert('✅ Copied!')).catch(() => alert('❌ Copy failed!'));
                  }} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Copy</button>

                  <button type="button" onClick={() => {
                    const orders = getFilteredAvPosReportOrders();
                    if (orders.length === 0) { alert("❌ No data!"); return; }
                    const headers = ['PO#','Invoice No#','Order Date','Ship Date','Status','Location','SOW'];
                    const rows = orders.map(o => [o.av_pos_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.sow||'']);
                    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'avpos_report.csv'; a.click();
                    URL.revokeObjectURL(url);
                  }} style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>CSV</button>

                  <button type="button" onClick={() => {
                    const orders = getFilteredAvPosReportOrders();
                    if (orders.length === 0) { alert("❌ No data!"); return; }
                    const wsData = [
                      ['PO#','Invoice No#','Order Date','Ship Date','Status','Location','SOW'],
                      ...orders.map(o => [o.av_pos_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.sow||''])
                    ];
                    const ws = XLSX.utils.aoa_to_sheet(wsData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'AV Pos');
                    XLSX.writeFile(wb, 'avpos_report.xlsx');
                  }} style={{ padding: "8px 16px", background: "#17a2b8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Excel</button>

                  <button type="button" onClick={() => {
                    const orders = getFilteredAvPosReportOrders();
                    if (orders.length === 0) { alert("❌ No data!"); return; }
                    const rows = orders.map(o => `<tr><td>${o.av_pos_no||''}</td><td>${o.invoice_no||''}</td><td>${formatDate(o.order_date)}</td><td>${formatDate(o.ship_date)}</td><td>${o.order_status||''}</td><td>${o.location||''}</td><td>${o.sow||''}</td></tr>`).join('');
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`<html><head><title>AV Pos Report</title><style>body{font-family:Arial,sans-serif;font-size:12px;margin:20px}table{width:100%;border-collapse:collapse}th{background:#2c5282;color:white;padding:8px;text-align:left;font-size:11px}td{border:1px solid #ddd;padding:8px;font-size:11px}tr:nth-child(even){background:#f2f2f2}</style></head><body><h2>AV Pos Report</h2><p>Total: ${orders.length}</p><table><thead><tr><th>PO#</th><th>Invoice No#</th><th>Order Date</th><th>Ship Date</th><th>Status</th><th>Location</th><th>SOW</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
                    printWindow.document.close(); printWindow.focus(); printWindow.print();
                  }} style={{ padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>Print</button>

                  <button type="button" onClick={() => {
                    const orders = getFilteredAvPosReportOrders();
                    if (orders.length === 0) { alert("❌ No data!"); return; }
                    const doc = new jsPDF({ orientation: 'landscape' });
                    doc.setFontSize(14); doc.text('AV Pos Report', 14, 15);
                    autoTable(doc, {
                      head: [['PO#','Invoice No#','Order Date','Ship Date','Status','Location','SOW']],
                      body: orders.map(o => [o.av_pos_no||'', o.invoice_no||'', formatDate(o.order_date), formatDate(o.ship_date), o.order_status||'', o.location||'', o.sow||'']),
                      startY: 28, styles: { fontSize: 8 }, headStyles: { fillColor: [44, 82, 130] }
                    });
                    doc.save('avpos_report.pdf');
                  }} style={{ padding: "8px 16px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>PDF</button>
                </div>

                {getFilteredAvPosReportOrders().length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No orders found matching the selected filters</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>PO#</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Invoice No#</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Order Date</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>SOW</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Status</th>
                          <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px", color: "#2c3e50" }}>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* FIX: was order.avPosNo, order.invoiceNo, order.orderDate, order.orderStatus */}
                        {getFilteredAvPosReportOrders().map((order) => (
                          <tr key={order.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.av_pos_no}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.invoice_no}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{formatDate(order.order_date)}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.sow || '-'}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.order_status}</td>
                            <td style={{ padding: "12px", fontSize: "12px", color: "#495057" }}>{order.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>
                      Showing 1 to {getFilteredAvPosReportOrders().length} of {getFilteredAvPosReportOrders().length} entries
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeOrdersPage === "hardware-software-pos-create" && (
            <div>
              <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>{editingHardwareSoftwarePosOrderId ? 'Hardware & Software POs - Edit' : 'Hardware & Software POs - Create'}</h1>
              <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Date /y</label>
                    <input type="date" value={hardwareSoftwarePosOrderForm.orderDate} onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, orderDate: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Est #</label>
                    <input type="text" value={hardwareSoftwarePosOrderForm.estNo} onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, estNo: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Product Type</label>
    <select value={hardwareSoftwarePosOrderForm.productType}
      onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, productType: e.target.value, partNumber: '', manufacturerName: '', specialRequest: ''})}
      style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
      <option value="">Select Product Type</option>
      <option value="hardware">Hardware</option>
      <option value="software">Software</option>
      <option value="services">Services</option>
    </select>
  </div>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Manufacturer Name</label>
    <select value={hardwareSoftwarePosOrderForm.manufacturerName}
      onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, manufacturerName: e.target.value, partNumber: '', specialRequest: ''})}
      style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
      <option value="">Select Manufacturer Name</option>
      {manufacturers.map((m) => (
        <option key={m.id} value={m.name}>{m.name}</option>
      ))}
    </select>
  </div>
  <div>
    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select Part Number</label>
    {hardwareSoftwarePosOrderForm.manufacturerName?.toLowerCase() === 'other' ? (
      <input type="text"
        value={hardwareSoftwarePosOrderForm.specialRequest || ''}
        onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, specialRequest: e.target.value})}
        placeholder="Enter special request..."
        style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
    ) : (
      <select value={hardwareSoftwarePosOrderForm.partNumber}
        onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, partNumber: e.target.value})}
        disabled={!hardwareSoftwarePosOrderForm.productType}
        style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
        <option value="">Select Part Number</option>
        {getItarPartByType(hardwareSoftwarePosOrderForm.productType, hardwareSoftwarePosOrderForm.manufacturerName)
  .map((partNum, i) => (
    <option key={i} value={partNum}>{partNum}</option>
  ))
}
      </select>
    )}
  </div>
</div>

{/* User + QTY + SN */}
{(() => {
  const isOther = hardwareSoftwarePosOrderForm.manufacturerName?.toLowerCase() === 'other';
  const isServices = hardwareSoftwarePosOrderForm.productType === 'services';
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "flex-end" }}>

      {/* Select User */}
      <div style={{ width: "400px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Select A Project  Manager</label>
        <select
          onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, userId: e.target.value})}
value={hardwareSoftwarePosOrderForm.userId}
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
          <option value="">Select A Project  Manager</option>
          {data.map((profile) => (
            <option key={profile.id} value={profile.id}>{profile.name} ({profile.username})</option>
          ))}
        </select>
      </div>

      {/* QTY */}
      {!isServices && (
        <div style={{ width: "200px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>QTY #</label>
          <input type="number" value={hardwareSoftwarePosOrderForm.qty}
            onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, qty: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      )}

      {/* S.N. */}
      {!isOther && (
        <div style={{ width: "260px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>S.N. #</label>
          <input type="text" value={hardwareSoftwarePosOrderForm.serialNumber}
            onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, serialNumber: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
        </div>
      )}

    </div>
  );
})()}

{/* Inline Item Rows */}
<div style={{ marginBottom: "28px" }}>
 {hwSwPosItemRows.map((row, idx) => {
  const isOtherRow = row.manufacturerName?.toLowerCase() === 'other';
  const isServicesRow = row.productType === 'services';
  return (
  <div key={row.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
      <div style={{ position: "relative", flex: 1.2, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
        <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
          {idx === 0 ? "Select Product Type" : "Type Of Product"}
        </span>
        <select value={row.productType} onChange={e => { updateHwSwPosRow(row.id, "productType", e.target.value); updateHwSwPosRow(row.id, "partNumber", ""); }}
          style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
          <option value=""></option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="services">Services</option>
        </select>
        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
      </div>
      <div style={{ position: "relative", flex: 1.2, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
        <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
          {idx === 0 ? "Select Manufacturer Name" : "Manufacturer Name"}
        </span>
        <select value={row.manufacturerName} onChange={e => updateHwSwPosRow(row.id, "manufacturerName", e.target.value)}
          style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
          <option value="">Select Manufacturer Name</option>
{manufacturers.map((m) => (
  <option key={m.id} value={m.name}>{m.name}</option>
))}
        </select>
        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
      </div>
      <div style={{ position: "relative", flex: 1.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
  <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 1 }}>
    {idx === 0 ? "Select Part Number" : "Part Number"}
  </span>
  {row.manufacturerName?.toLowerCase() === 'other' ? (
    <input type="text" value={row.specialRequest || ''}
      onChange={e => updateHwSwPosRow(row.id, "specialRequest", e.target.value)}
      placeholder="Enter special request..."
      style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
  ) : (
    <select value={row.partNumber} onChange={e => updateHwSwPosRow(row.id, "partNumber", e.target.value)}
      style={{ width: "100%", padding: "11px 28px 11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", cursor: "pointer", outline: "none", color: "#333", appearance: "none", WebkitAppearance: "none" }}>
      <option value=""></option>
      {getItarPartByType(row.productType, row.manufacturerName)
        .map((partNum, i) => (
          <option key={i} value={partNum}>{partNum}</option>
        ))
      }
    </select>
  )}
  <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#7a90a4", fontSize: "10px" }}>▾</span>
</div>
      {!isServicesRow && (
        <div style={{ position: "relative", flex: 0.5, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
          <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", zIndex: 1 }}>
            {idx === 0 ? "QTY #" : "QTY#"}
          </span>
          <input type="number" min="1" value={row.qty} onChange={e => updateHwSwPosRow(row.id, "qty", e.target.value)}
            style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
        </div>
      )}
      {!isOtherRow && (
        <div style={{ position: "relative", flex: 0.7, border: "1px solid #cfd8e3", borderRadius: "6px", background: "#fff" }}>
          <span style={{ position: "absolute", top: "-9px", left: "12px", background: "#fff", padding: "0 4px", fontSize: "11px", color: "#7a90a4", fontWeight: "500", pointerEvents: "none", zIndex: 1 }}>
            {idx === 0 ? "S.N. #" : "S.N.#"}
          </span>
          <input type="text" value={row.serialNumber} onChange={e => updateHwSwPosRow(row.id, "serialNumber", e.target.value)}
            style={{ width: "100%", padding: "11px 12px", border: "none", borderRadius: "6px", fontSize: "13px", background: "transparent", outline: "none", color: "#333", boxSizing: "border-box" }} />
        </div>
      )}
      <button onClick={() => removeHwSwPosRow(row.id)}
        style={{ width: "34px", height: "34px", flexShrink: 0, borderRadius: "50%", background: "#1a2a4a", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>
        ✕
      </button>
    </div>
  );
})}
  <button onClick={addHwSwPosRow}
    style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#4a5568", color: "#fff", border: "none", cursor: "pointer", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
    ＋
  </button>
</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Location</label>
                    <input type="text" value={hardwareSoftwarePosOrderForm.location} onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, location: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>PO #</label>
                    <input type="text" value={hardwareSoftwarePosOrderForm.poNo} onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, poNo: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Upload POD File</label>
                  {editingHardwareSoftwarePosOrderId && Array.isArray(selectedHwSwPosOrder?.pod_files) && selectedHwSwPosOrder.pod_files.length > 0 && (
  <div style={{ marginBottom: "12px", padding: "10px 14px", background: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd" }}>
    <div style={{ fontSize: "12px", fontWeight: "700", color: "#0369a1", marginBottom: "8px" }}>📎 Existing POD Files:</div>
    {selectedHwSwPosOrder.pod_files.map((file, fi) => (
      <div key={file.id || fi} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <a href={`http://localhost:8081/uploads/${file.filename}`}
          target="_blank" rel="noreferrer"
          style={{ color: "#2563eb", fontSize: "13px", textDecoration: "underline", flex: 1 }}>
          📄 {file.original_name}
        </a>
        <button type="button"
          onClick={async () => {
            try {
              await axios.delete(`http://localhost:8081/orders/hwswpos/pod-files/${file.id}`);
              setSelectedHwSwPosOrder(prev => ({
                ...prev,
                pod_files: prev.pod_files.filter(f => f.id !== file.id)
              }));
            } catch (err) {
              alert('❌ Delete failed');
            }
          }}
          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>
          🗑️ Remove
        </button>
      </div>
    ))}
  </div>
)}
                 {hwSwPodFileInputs.map((entry, index) => ( 
  <div key={entry.id} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: index < hwSwPodFileInputs.length - 1 ? "10px" : "0" }}>
    <input
      type="file"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
      onChange={(e) => {
  const file = e.target.files[0];
  const updated = hwSwPodFileInputs.map(f =>
    f.id === entry.id ? { ...f, file: file } : f
  );
  setHwSwPodFileInputs(updated);
  hwSwPodFilesRef.current = updated.map(f => f.file).filter(Boolean);
  console.log('📎 File selected:', file?.name);
  console.log('📎 Ref updated:', hwSwPodFilesRef.current);
}}
      style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
    />
    {index === 0 ? (
      <button type="button"
        onClick={() => setHwSwPodFileInputs([...hwSwPodFileInputs, { id: Date.now(), file: null }])}
        style={{ padding: "8px 24px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
        Add
      </button>
    ) : (
      <button type="button"
        onClick={() => setHwSwPodFileInputs(hwSwPodFileInputs.filter(f => f.id !== entry.id))}
        style={{ padding: "8px 18px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
        X
      </button>
    )}
  </div>
))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Ship Date /y</label>
                    <input type="date" value={hardwareSoftwarePosOrderForm.shipDate} onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, shipDate: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Invoice #</label>
                    <input type="text" value={hardwareSoftwarePosOrderForm.invoiceNo} onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, invoiceNo: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Status #</label>
                  <select value={hardwareSoftwarePosOrderForm.orderStatus} onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, orderStatus: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                    <option value="">Select a order status</option>
                    <option value="Backorder">Backorder</option>
                    <option value="Open">Open</option>
                    <option value="Completed">Completed</option>
                    <option value="Voided">Voided</option>
                  </select>
                </div>

                {/* ✅ Remark / Comment — Order Status ke baad add karo */}
<div style={{ marginBottom: "20px" }}>
  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Remark / Comment</label>
  <textarea
    value={hardwareSoftwarePosOrderForm.remark || ''}
    onChange={(e) => setHardwareSoftwarePosOrderForm({...hardwareSoftwarePosOrderForm, remark: e.target.value})}
    placeholder="Enter remark or comment..."
    rows={4}
    style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
  />
</div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={handleResetHardwareSoftwarePosForm} style={{ background: "#6c757d", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>Reset</button>
                  <button type="button" onClick={handleSaveHardwareSoftwarePosOrder} style={{ background: "#5cb85c", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                    💾 {editingHardwareSoftwarePosOrderId ? 'Update Order' : 'Save Order'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeOrdersPage === "hardware-software-pos-list" && (
  <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
    <style>{`
      .hwsw-row:hover { box-shadow: -3px 0 0 #3b82f6 !important; background: linear-gradient(90deg, #eff6ff 0%, #f8faff 100%) !important; }
    `}</style>

    <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", padding: "32px 32px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em", display: "inline-block", marginBottom: "10px" }}>ORDERS MANAGEMENT</span>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>Hardware & Software POs</h1>
          <p style={{ margin: "6px 0 0", fontSize: "15px", color: "rgba(255,255,255,0.75)" }}>Manage all hardware & software purchase orders</p>
        </div>
       {hasPermission('Hardware-software-pos-Add') && (
  <button onClick={() => { setEditingHardwareSoftwarePosOrderId(null); setHardwareSoftwarePosOrderForm({ orderDate:'',estNo:'',productType:'',userId:'',manufacturerName:'',partNumber:'',qty:'',serialNumber:'',location:'',poNo:'',shipDate:'',invoiceNo:'',orderStatus:'', remark:'' }); setActiveOrdersPage('hardware-software-pos-create'); }}
    style={{ background: "white", color: "#1e3a8a", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
    <span style={{ fontSize: "18px" }}>+</span> New HW/SW PO
  </button>
)}
      </div>
    </div>

    <div style={{ padding: "0 32px", marginTop: "-44px", position: "relative", zIndex: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {[
          { label: "Total POs", value: hardwareSoftwarePosOrders.length, icon: "💾", color: "#3b82f6", light: "#eff6ff" },
          { label: "Open", value: hardwareSoftwarePosOrders.filter(o => o.order_status === 'Open').length, icon: "🔓", color: "#f59e0b", light: "#fffbeb" },
          { label: "Completed", value: hardwareSoftwarePosOrders.filter(o => o.order_status === 'Completed').length, icon: "✅", color: "#10b981", light: "#ecfdf5" },
          { label: "Backorder", value: hardwareSoftwarePosOrders.filter(o => o.order_status === 'Backorder').length, icon: "⏳", color: "#ef4444", light: "#fef2f2" },
          { label: "Voided", value: hardwareSoftwarePosOrders.filter(o => o.order_status === 'Voided').length, icon: "📪", color: "#6b7280", light: "#f9fafb" },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ background: "white", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: stat.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: "30px", fontWeight: "800", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px", fontWeight: "500" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: "24px 32px 32px" }}>
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Show</span>
            <select value={hardwareSoftwarePosEntriesPerPage} onChange={(e) => {setHardwareSoftwarePosEntriesPerPage(Number(e.target.value)); setHwSwPosCurrentPage(1); }}
              style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "white" }}>
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
            </select>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>entries</span>
            <span style={{ marginLeft: "8px", background: "#dbeafe", color: "#1e40af", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{filteredHardwareSoftwarePosOrders.length} records</span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔍</span>
            <input type="text" placeholder="Search HW/SW POs..." value={hardwareSoftwarePosListSearchTerm} onChange={(e) => setHardwareSoftwarePosListSearchTerm(e.target.value)}
              style={{ padding: "9px 14px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "13px", width: "240px", color: "#374151" }} />
          </div>
        </div>

        {filteredHardwareSoftwarePosOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>💾</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>No HW/SW POs Yet</div>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "6px" }}>Create your first hardware & software PO</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1500px" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                    {["#","PO#", "Assigned User", "Order Date", "Est #",  "Product Type", "Manufacturer", "SPLIT", "QTY", "Serial No#", "Location", "Ship Date", "Invoice No#",  "Status", "Actions"].map((h, i) => (
  <th key={i} style={{ padding: "13px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
    {h === "SPLIT" ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "700", border: "1px solid #bfdbfe", display: "inline-block" }}>
          # Part No
        </span>
        <span style={{ background: "#fef3c7", color: "#92400e", padding: "3px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "700", border: "1px solid #fcd34d", display: "inline-block" }}>
          ✦ Special Request
        </span>
      </div>
    ) : h}
  </th>
))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHardwareSoftwarePosOrders.slice(
  (hwSwPosCurrentPage - 1) * hardwareSoftwarePosEntriesPerPage,
  hwSwPosCurrentPage * hardwareSoftwarePosEntriesPerPage
).map((order, idx) => {
                    const name = order.assigned_user_name || order.assigned_username || '';
                    const initials = name ? name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) : '?';
                    const avatarPalette = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899'];
                    const avatarBg = avatarPalette[(order.id||idx) % avatarPalette.length];
                    const statusConfig = {
                      'Completed': { bg: '#ecfdf5', color: '#065f46', border: '#6ee7b7', dot: '#10b981' },
                      'Open': { bg: '#fffbeb', color: '#92400e', border: '#fcd34d', dot: '#f59e0b' },
                      'Backorder': { bg: '#fef2f2', color: '#991b1b', border: '#fca5a5', dot: '#ef4444' },
                      'Voided': { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb', dot: '#9ca3af' },
                    };
                    const sc = statusConfig[order.order_status] || statusConfig['Voided'];
                    return (
                      <React.Fragment key={order.id}>
                        <tr className="order-row hwsw-row" style={{ borderBottom: "1px solid #f9fafb" }}>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#d1d5db", fontWeight: "600" }}>{String(idx+1).padStart(2,'0')}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <span
 onClick={async () => {
  setSelectedHwSwPosOrder({ ...order, pod_files: [] });
  setActiveOrdersPage('hwswpos-detail');
  try {
    const res = await axios.get(`http://localhost:8081/orders/hwswpos/${order.id}/pod-files`);
    setSelectedHwSwPosOrder(prev => ({ ...prev, pod_files: res.data }));
  } catch (e) {
    console.log('No pod files found');
  }
}}
    
  style={{ background: "linear-gradient(135deg, #dbeafe, #bfdbfe)", color: "#1e40af", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "2px" }}>
  {order.po_no || '—'}
</span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            {name ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)`, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", flexShrink: 0, boxShadow: `0 2px 8px ${avatarBg}55` }}>{initials}</div>
                                <div>
                                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#1f2937" }}>{order.assigned_user_name || name}</div>
                                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>@{order.assigned_username}</div>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>👤</div>
                                <span style={{ fontSize: "12px", color: "#d1d5db" }}>Unassigned</span>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(order.order_date) || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{order.est_no || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.product_type || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.manufacturer_name || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                         <td style={{ padding: "14px 16px", fontSize: "13px" }}>
  {order.manufacturer_name?.toLowerCase() === 'other' ? (
    order.special_request ? (
      <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #fcd34d" }}>
        ✦ {order.special_request}
      </span>
    ) : <span style={{color:"#e5e7eb"}}>—</span>
  ) : (
    order.part_number ? (
      <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #bfdbfe", fontFamily: "monospace" }}>
        # {order.part_number}
      </span>
    ) : <span style={{color:"#e5e7eb"}}>—</span>
  )}
</td>
                          <td style={{ padding: "14px 16px", textAlign: "center" }}>
                            {order.qty ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{order.qty}</span> : <span style={{color:"#e5e7eb"}}>—</span>}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "12px", fontFamily: "monospace", color: "#374151" }}>{order.serial_number || <span style={{color:"#e5e7eb",fontFamily:"sans-serif"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.location || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(order.ship_date) || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>{order.invoice_no || <span style={{color:"#e5e7eb"}}>—</span>}</td>
                          
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                              {order.order_status || '—'}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    {Array.isArray(order.items) && order.items.length > 0 ? (
      <button onClick={() => setExpandedHwSwOrderId(expandedHwSwOrderId === order.id ? null : order.id)}
        style={{ background: expandedHwSwOrderId === order.id ? "#dbeafe" : "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", minWidth: "44px", textAlign: "center" }}>
        {expandedHwSwOrderId === order.id ? "▲" : "▼"} {order.items.length}
      </button>
    ) : (
      <span style={{ minWidth: "44px", display: "inline-block" }} />
    )}
    {hasPermission('Hardware-software-pos-Edit') && (
<button type="button" className="action-btn edit-btn"
  onClick={async () => {
    const profile = data.find(p => p.username === order.assigned_username);
    setHardwareSoftwarePosOrderForm({
      orderDate: order.order_date ? order.order_date.toString().split('T')[0] : '',
      estNo: order.est_no || '',
      productType: order.product_type || '',
      userId: profile ? String(profile.id) : '',
      manufacturerName: order.manufacturer_name || '',
      partNumber: order.part_number || '',
      specialRequest: order.special_request || '',
      qty: order.qty || '',
      serialNumber: order.serial_number || '',
      location: order.location || '',
      poNo: order.po_no || '',
      shipDate: order.ship_date ? order.ship_date.toString().split('T')[0] : '',
      invoiceNo: order.invoice_no || '',
      orderStatus: order.order_status || '',
      remark: order.remark || ''
    });
    setHwSwPosItemRows(Array.isArray(order.items) && order.items.length > 0 ? order.items : []);
    setEditingHardwareSoftwarePosOrderId(order.id);
    setSelectedHwSwPosOrder({ ...order, pod_files: [] });
    try {
      const podRes = await axios.get(`http://localhost:8081/orders/hwswpos/${order.id}/pod-files`);
      setSelectedHwSwPosOrder({ ...order, pod_files: podRes.data });
    } catch (e) {}
    setActiveOrdersPage('hardware-software-pos-create');
  }}
  style={{ background: "#eff6ff", color: "#2563e", border: "1px solid #bfdbfe", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>✏️ Edit</button>
)}

{hasPermission('Hardware-software-pos-Delete') && (
<button type="button" className="action-btn del-btn" 
  onClick={() => handleDeleteHardwareSoftwarePosOrder(order.id)}
  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>🗑️</button>
)}
  </div>
</td>
                        </tr>
                        {expandedHwSwOrderId=== order.id && Array.isArray(order.items) && order.items.length > 0 && (
                          <tr>
                            <td colSpan={15} style={{ padding: 0, background: "#f0f6ff" }}>
                              <div style={{ padding: "14px 24px 18px 48px", borderBottom: "2px solid #bfdbfe", borderTop: "1px solid #bfdbfe" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e40af", letterSpacing: "0.05em" }}>📦 ITEM ROWS</span>
                                  <span style={{ background: "#dbeafe", color: "#1e40af", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{order.items.length} items</span>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                  <thead>
                                    <tr style={{ background: "#dbeafe" }}>
                                      {["#", "Product Type", "Manufacturer", "Part Number", "QTY", "Serial No."].map((h, i) => (
                                        <th key={i} style={{ padding: "8px 14px", textAlign: "left", color: "#1e40af", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #bfdbfe" }}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, i) => (
                                      <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#eff6ff", borderBottom: "1px solid #dbeafe" }}>
                                        <td style={{ padding: "8px 14px", color: "#9ca3af", fontWeight: "600" }}>{String(i+1).padStart(2,'0')}</td>
                                        <td style={{ padding: "8px 14px" }}>
                                          {item.productType ? <span style={{ background: "#dbeafe", color: "#1e40af", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>{item.productType}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
                                        </td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontWeight: "500" }}>{item.manufacturerName || <span style={{ color: "#e5e7eb" }}>—</span>}</td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontFamily: "monospace" }}>{item.partNumber || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}</td>
                                        <td style={{ padding: "8px 14px" }}>
                                          {item.qty ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{item.qty}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
                                        </td>
                                        <td style={{ padding: "8px 14px", color: "#374151", fontFamily: "monospace" }}>{item.serialNumber || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Showing <strong style={{color:"#1f2937"}}>{Math.min(hardwareSoftwarePosEntriesPerPage, filteredHardwareSoftwarePosOrders.length)}</strong> of <strong style={{color:"#1f2937"}}>{filteredHardwareSoftwarePosOrders.length}</strong> entries</span>
              <div style={{ display: "flex", gap: "4px" }}>
               {(() => {
  const total = Math.ceil(filteredHardwareSoftwarePosOrders.length / hardwareSoftwarePosEntriesPerPage) || 1;
  return (
    <>
      <button onClick={() => setHwSwPosCurrentPage(p => Math.max(1, p-1))} disabled={hwSwPosCurrentPage===1}
  style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"white", color: hwSwPosCurrentPage===1?"#d1d5db":"#6b7280", cursor: hwSwPosCurrentPage===1?"not-allowed":"pointer", fontSize:"13px" }}>
  ← Prev
</button>
{Array.from({length: total}, (_,i) => i+1).map(page => (
  <button key={page} onClick={() => setHwSwPosCurrentPage(page)}
    style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background: page===hwSwPosCurrentPage?"linear-gradient(135deg,#1e3a8a,#3b82f6)":"white", color: page===hwSwPosCurrentPage?"white":"#6b7280", cursor:"pointer", fontSize:"13px", fontWeight: page===hwSwPosCurrentPage?"700":"400" }}>
    {page}
  </button>
))}
<button onClick={() => setHwSwPosCurrentPage(p => Math.min(total, p+1))} disabled={hwSwPosCurrentPage===total}
  style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px", background:"white", color: hwSwPosCurrentPage===total?"#d1d5db":"#6b7280", cursor: hwSwPosCurrentPage===total?"not-allowed":"pointer", fontSize:"13px" }}>
  Next →
</button>
    </>
  );
})()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
          )}

          {activeOrdersPage === "hwswpos-detail" && selectedHwSwPosOrder && (() => {
  const order = selectedHwSwPosOrder;
  const getDescription = (partNumber, manufacturerName, productType) => {
  if (!partNumber) return '';
  const matched = products?.find(p => 
    p.part_number?.trim().toLowerCase() === partNumber?.trim().toLowerCase() &&
    p.manufacturer_name?.trim().toLowerCase() === manufacturerName?.trim().toLowerCase() &&
    p.product_type?.trim().toLowerCase() === productType?.trim().toLowerCase()
  );
  return matched?.product_description || '';
};
  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];

  const statusConfig = {
    'Open':      { active: '#f59e0b', light: '#fffbeb', border: '#fcd34d' },
    'Backorder': { active: '#ef4444', light: '#fef2f2', border: '#fca5a5' },
    'Completed': { active: '#10b981', light: '#ecfdf5', border: '#6ee7b7' },
    'Voided':    { active: '#6b7280', light: '#f9fafb', border: '#e5e7eb' },
  };
  const currentStatus = order.order_status || 'Open';
  const statusSteps = ['Open', 'Backorder', 'Completed', 'Voided'];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", padding: "32px 32px 28px", position: "relative", overflow: "hidden", animation: "fadeSlideIn 0.4s ease" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <button onClick={() => setActiveOrdersPage('hardware-software-pos-list')}
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", marginBottom: "16px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Back
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "4px", fontWeight: "500", letterSpacing: "0.05em" }}>HW/SW POS ORDER DETAIL</div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "white" }}>PO# : {order.po_no || '—'}</h1>
              {order.est_no && <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", marginTop: "4px" }}>Est # {order.est_no}</div>}
            </div>
            <button onClick={async () => {
  const profile = data.find(p => p.username === order.assigned_username);
  setHardwareSoftwarePosOrderForm({
  orderDate: order.order_date ? order.order_date.toString().split('T')[0] : '',
  estNo: order.est_no || '',
  productType: order.product_type || '',
  userId: profile ? String(profile.id) : '',
  manufacturerName: order.manufacturer_name || '',
  partNumber: order.part_number || '',
  specialRequest: order.special_request || '',
  qty: order.qty || '',
  serialNumber: order.serial_number || '',
  location: order.location || '',
  poNo: order.po_no || '',
  shipDate: order.ship_date ? order.ship_date.toString().split('T')[0] : '',
  invoiceNo: order.invoice_no || '',
  orderStatus: order.order_status || '',
  remark: order.remark || ''
});
  setHwSwPosItemRows(Array.isArray(order.items) && order.items.length > 0 ? order.items : []);
  setEditingHardwareSoftwarePosOrderId(order.id);
  // ✅ Pod files fetch karo
  setSelectedHwSwPosOrder({ ...order, pod_files: [] });
  try {
    const podRes = await axios.get(`http://localhost:8081/orders/hwswpos/${order.id}/pod-files`);
    setSelectedHwSwPosOrder({ ...order, pod_files: podRes.data });
  } catch (e) {
    console.log('No pod files');
  }
  setActiveOrdersPage('hardware-software-pos-create');
}}
  style={{ background: "white", color: "#1e3a8a", border: "none", padding: "10px 22px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
  ✏️ Edit Order
</button>
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{ background: "white", borderBottom: "1px solid #f3f4f6", padding: "0 32px" }}>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {statusSteps.map((step) => {
            const isActive = step === currentStatus;
            const sc = statusConfig[step] || statusConfig['Voided'];
            return (
              <div key={step} style={{
                padding: "14px 32px", fontSize: "13px",
                fontWeight: isActive ? "700" : "500",
                color: isActive ? sc.active : "#9ca3af",
                borderBottom: isActive ? `3px solid ${sc.active}` : "3px solid transparent",
                background: isActive ? sc.light : "transparent",
                whiteSpace: "nowrap", transition: "all 0.2s"
              }}>
                {isActive && <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sc.active, display: "inline-block", marginRight: "8px", verticalAlign: "middle" }} />}
                {step}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "28px 32px" }}>

        {/* ── STATUS + COMMENTS 2-column ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>📋 Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "14px", color: "#374151" }}><span style={{ fontWeight: "700", color: "#1e40af" }}>PO # :</span> {order.po_no || '—'}</div>
              <div style={{ fontSize: "14px", color: "#374151" }}><span style={{ fontWeight: "700" }}>Invoice :</span> {order.invoice_no || '—'}</div>
              <div style={{ fontSize: "14px", color: "#374151" }}><span style={{ fontWeight: "700" }}>Location :</span> {order.location || '—'}</div>
              <div style={{ fontSize: "14px", color: "#374151" }}><span style={{ fontWeight: "700" }}>Order Date :</span> {order.order_date ? order.order_date.toString().split('T')[0] : '—'}</div>
              <div style={{ fontSize: "14px", color: "#374151" }}><span style={{ fontWeight: "700" }}>Ship Date :</span> {order.ship_date ? order.ship_date.toString().split('T')[0] : '—'}</div>
            </div>
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#9ca3af" }}>
              <span>Created By : {order.assigned_user_name || order.assigned_username || '—'}</span>
              <span>Updated By : —</span>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "24px" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>💬 Comments</h3>
            <div style={{ minHeight: "80px", padding: "14px 18px", background: "#f9fafb", borderRadius: "10px", border: "1px solid #f3f4f6", fontSize: "14px", color: order.remark ? "#374151" : "#d1d5db", lineHeight: "1.7" }}>
              {order.remark || <em>No comments added.</em>}
            </div>
          </div>
        </div>

        {/* ── INFO CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Product Type", value: order.product_type || '—', icon: "📦" },
            { label: "Manufacturer",  value: order.manufacturer_name || '—', icon: "🏭" },
            { label: "Part No#",      value: order.part_number || '—', icon: "🔩" },
            { label: "QTY",           value: order.qty || '—', icon: "🔢" },
            { label: "Serial No#",    value: order.serial_number || '—', icon: "🏷️" },
            { label: "Assigned To",   value: order.assigned_user_name || order.assigned_username || '—', icon: "👤" },
          ].map((info, i) => (
            <div key={i} style={{ background: "white", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "22px" }}>{info.icon}</span>
              <div>
                <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>{info.label}</div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", marginTop: "2px" }}>{info.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ORDER TRACKING TABLE ── */}
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1f2937" }}>📦 Order Tracking</h3>
            <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
  Items
</span>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#6b7280" }}>No inline items in this order</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                    {["Line", "Product Type", "Part Number", "Manufacturer", "Description", "QTY", "Serial No."].map((h, i) => (
                      <th key={i} style={{ padding: "13px 18px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
  {/* ── Main Order Row ── */}
  <tr style={{ borderBottom: "2px solid #d1fae5", background: "#f0fdf9" }}>
   <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "700", color: "#065f46" }}>1</td>
    <td style={{ padding: "14px 18px" }}>
      {order.product_type ? (
        <span style={{
          background: order.product_type?.toLowerCase() === 'hardware' ? '#eff6ff' : order.product_type?.toLowerCase() === 'software' ? '#f0fdf4' : order.product_type?.toLowerCase() === 'services' ? '#fef3c7' : '#f5f3ff',
          color: order.product_type?.toLowerCase() === 'hardware' ? '#1d4ed8' : order.product_type?.toLowerCase() === 'software' ? '#15803d' : order.product_type?.toLowerCase() === 'services' ? '#92400e' : '#5b21b6',
          padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize"
        }}>{order.product_type}</span>
      ) : <span style={{ color: "#e5e7eb" }}>—</span>}
    </td>
    <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
      {order.part_number || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
    </td>
    <td style={{ padding: "14px 18px", fontSize: "13px", fontWeight: "600", color: "#374151" }}>
      {order.manufacturer_name || <span style={{ color: "#e5e7eb" }}>—</span>}
    </td>
    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280", maxWidth: "280px" }}>
  {order.manufacturer_name?.toLowerCase() === 'other'
    ? (order.special_request
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>{order.special_request}</div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
    : (getDescription(order.part_number, order.manufacturer_name, order.product_type)
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>
            {getDescription(order.part_number, order.manufacturer_name, order.product_type)}
          </div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
  }
</td>
    <td style={{ padding: "14px 18px", textAlign: "center" }}>
      {order.qty
        ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{order.qty}</span>
        : <span style={{ color: "#e5e7eb" }}>—</span>}
    </td>
    <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
      {order.serial_number || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
    </td>
    <td style={{ padding: "14px 18px" }}></td>
  </tr>

  {/* ── Inline Item Rows ── */}
  {items.map((item, i) => {
    const isServices = item.productType?.toLowerCase() === 'services' || item.product_type?.toLowerCase() === 'services';
    const mfgName    = item.manufacturerName || item.manufacturer_name || '—';
    const partNum    = item.partNumber || item.part_number || '';
    const serialNo   = item.serialNumber || item.serial_number || '';
    const qty        = item.qty || '';
    const prodType   = item.productType || item.product_type || '';
    const description = getDescription(
  item.partNumber || item.part_number,
  item.manufacturerName || item.manufacturer_name,
  item.productType || item.product_type
);
    const ptColors = {
      hardware: { bg: '#eff6ff', color: '#1d4ed8' },
      software: { bg: '#f0fdf4', color: '#15803d' },
      services: { bg: '#fef3c7', color: '#92400e' },
    };
    const ptC = ptColors[prodType?.toLowerCase()] || { bg: '#f5f3ff', color: '#5b21b6' };
    return (
      <tr key={i} style={{ borderBottom: "1px solid #f9fafb", background: i % 2 === 0 ? "white" : "#f9fafb" }}>
        <td style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "700", color: "#6b7280" }}>{i + 2}</td>
        <td style={{ padding: "14px 18px" }}>
          {prodType ? <span style={{ background: ptC.bg, color: ptC.color, padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" }}>{prodType}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
        </td>
        <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
          {partNum || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
        </td>
        <td style={{ padding: "14px 18px", fontSize: "13px", fontWeight: "600", color: "#374151" }}>{mfgName}</td>
        <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280", maxWidth: "280px" }}>
  {(item.manufacturerName || item.manufacturer_name)?.toLowerCase() === 'other'
    ? ((item.specialRequest || item.special_request)
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>{item.specialRequest || item.special_request}</div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
    : (description
        ? <div style={{ lineHeight: "1.5", whiteSpace: "normal", wordBreak: "break-word" }}>{description}</div>
        : <span style={{ color: "#e5e7eb" }}>—</span>)
  }
</td>
        <td style={{ padding: "14px 18px", textAlign: "center" }}>
          {!isServices && qty ? <span style={{ background: "#f0fdf4", color: "#15803d", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid #bbf7d0" }}>{qty}</span> : <span style={{ color: "#e5e7eb" }}>—</span>}
        </td>
        <td style={{ padding: "14px 18px", fontSize: "13px", fontFamily: "monospace", color: "#374151" }}>
          {serialNo || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
        </td>
        <td style={{ padding: "14px 18px" }}></td>
      </tr>
    );
  })}
</tbody>
              </table>
            </div>
          )}

         
{/* ── POD FILE SECTION ── */}

<PodFilesSection order={order} orderType="hwswpos" setSelectedOrder={setSelectedHwSwPosOrder} />

        </div>
      </div>
    </div>
  );
})()}

          {activeOrdersPage === "hardware-software-pos-report" && (
            <div>
              <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>Hardware & Software POs - Report</h1>
              <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid #e0e0e0" }}>
                  <button type="button" onClick={() => setHardwareSoftwarePosReportFilters({...hardwareSoftwarePosReportFilters, reportType: 'location'})} style={{ padding: "12px 24px", background: hardwareSoftwarePosReportFilters.reportType === 'location' ? "#2c5282" : "transparent", color: hardwareSoftwarePosReportFilters.reportType === 'location' ? "white" : "#666", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>🌍 HW/SW POS REPORT LOCATION WISE</button>
                  <button type="button" onClick={() => setHardwareSoftwarePosReportFilters({...hardwareSoftwarePosReportFilters, reportType: 'product'})} style={{ padding: "12px 24px", background: hardwareSoftwarePosReportFilters.reportType === 'product' ? "#2c5282" : "transparent", color: hardwareSoftwarePosReportFilters.reportType === 'product' ? "white" : "#666", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>📦 HW/SW POS REPORT PRODUCT TYPE</button>
                </div>
                {hardwareSoftwarePosReportFilters.reportType === 'location' ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Order Status</label>
                      <select value={hardwareSoftwarePosReportFilters.orderStatus} onChange={(e) => setHardwareSoftwarePosReportFilters({...hardwareSoftwarePosReportFilters, orderStatus: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select order status</option>
                        <option value="Backorder">Backorder</option>
                        <option value="Open">Open</option>
                        <option value="Completed">Completed</option>
                        <option value="Voided">Voided</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Location</label>
                      <select value={hardwareSoftwarePosReportFilters.location} onChange={(e) => setHardwareSoftwarePosReportFilters({...hardwareSoftwarePosReportFilters, location: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select Location</option>
                        <option value="Pickering">Pickering</option>
                        <option value="Darlington">Darlington</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Product Type</label>
                      <select value={hardwareSoftwarePosReportFilters.productType} onChange={(e) => setHardwareSoftwarePosReportFilters({...hardwareSoftwarePosReportFilters, productType: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select a option</option>
                        <option value="hardware">Hardware</option>
                        <option value="software">Software</option>
                        <option value="services">Services</option>
                        
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Manufacturer Name</label>
                      <select value={hardwareSoftwarePosReportFilters.manufacturerName} onChange={(e) => setHardwareSoftwarePosReportFilters({...hardwareSoftwarePosReportFilters, manufacturerName: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                        <option value="">Select Manufacturer Name</option>
{manufacturers.map((m) => (
  <option key={m.id} value={m.name}>{m.name}</option>
))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Part Number</label>
                     <select value={hardwareSoftwarePosReportFilters.partNumber} onChange={(e) => setHardwareSoftwarePosReportFilters({...hardwareSoftwarePosReportFilters, partNumber: e.target.value})} style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
  <option value="">Select</option>
  {products
    .filter(p => p.product_type === hardwareSoftwarePosReportFilters.productType?.toLowerCase() && p.part_number)
    .map((p, i) => (
      <option key={i} value={p.part_number}>{p.part_number}</option>
    ))
  }
</select>
                    </div>
                  </div>
                )}
                {getFilteredHardwareSoftwarePosReportOrders().length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>No orders found matching the selected filters</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                          {["PO#","Invoice No#","Order Date","Ship Date","Status","Location","Product Type","Manufacturer","Part No"].map(h => (
                            <th key={h} style={{ padding: "12px", textAlign: "left", fontWeight: "600", fontSize: "12px" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* FIX: was order.poNo, order.invoiceNo, order.orderDate etc. */}
                        {getFilteredHardwareSoftwarePosReportOrders().map((order) => (
                          <tr key={order.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{order.po_no}</td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{order.invoice_no}</td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{formatDate(order.order_date)}</td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{formatDate(order.ship_date)}</td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{order.order_status}</td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{order.location}</td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{order.product_type}</td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{order.manufacturer_name}</td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>{order.part_number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>Showing 1 to {getFilteredHardwareSoftwarePosReportOrders().length} of {getFilteredHardwareSoftwarePosReportOrders().length} entries</div>
                  </div>
                )}
              </div>
            </div>
          )}

         {activeOrdersPage === "product-management-create" && 
 (hasPermission('product-create') || hasPermission('product-edit')) && (
  <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5", padding: "30px" }}>
    <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "30px 40px", maxWidth: "1100px" }}>
      
      <h2 style={{ margin: "0 0 30px 0", color: "#1a2a4a", fontSize: "22px", fontWeight: "700", borderBottom: "2px solid #e8edf5", paddingBottom: "15px" }}>
        Add Product
      </h2>

      {/* Type of Product */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "28px", gap: "40px" }}>
        <label style={{ minWidth: "200px", fontSize: "14px", fontWeight: "600", color: "#2c3e50", paddingTop: "4px" }}>
          Type of Product
        </label>
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          {["Software", "Hardware", "Services"].map((type) => (
            <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#444" }}>
              <input
                type="radio"
                name="productType"
                value={type.toLowerCase()}
                checked={productForm.productType === type.toLowerCase()}
                onChange={(e) => setProductForm({ ...productForm, productType: e.target.value, partNumber: '', manufacturerName: '' })}
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#1a2a4a" }}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Manufacturer Name */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "28px", gap: "40px" }}>
        <label style={{ minWidth: "200px", fontSize: "14px", fontWeight: "600", color: "#2c3e50" }}>
          Manufacturer Name
        </label>
        <select
          value={productForm.manufacturerName}
          onChange={(e) => setProductForm({ ...productForm, manufacturerName: e.target.value, partNumber: '' })}
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #d0d7e3", borderRadius: "6px", fontSize: "14px", color: productForm.manufacturerName ? "#333" : "#999", background: "white", outline: "none", cursor: "pointer" }}
        >
          <option value="">Select</option>
          {manufacturers.map((m) => (
            <option key={m.id} value={m.name}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Part Number - INPUT FIELD (type karo) */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "28px", gap: "40px" }}>
        <label style={{ minWidth: "200px", fontSize: "14px", fontWeight: "600", color: "#2c3e50" }}>
          Part Number
        </label>
        <input
          type="text"
          value={productForm.partNumber}
          onChange={(e) => setProductForm({ ...productForm, partNumber: e.target.value })}
          placeholder="Enter part number"
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #d0d7e3", borderRadius: "6px", fontSize: "14px", color: "#333", outline: "none" }}
          onFocus={(e) => e.target.style.borderColor = "#1a2a4a"}
          onBlur={(e) => e.target.style.borderColor = "#d0d7e3"}
        />
      </div>

      {/* Product Description */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "28px", gap: "40px" }}>
        <label style={{ minWidth: "200px", fontSize: "14px", fontWeight: "600", color: "#2c3e50", paddingTop: "10px" }}>
          Product Description
        </label>
        <textarea
          value={productForm.productDescription}
          onChange={(e) => setProductForm({ ...productForm, productDescription: e.target.value })}
          placeholder="Detail"
          rows={6}
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #d0d7e3", borderRadius: "6px", fontSize: "14px", color: "#333", resize: "vertical", outline: "none", fontFamily: "inherit" }}
          onFocus={(e) => e.target.style.borderColor = "#1a2a4a"}
          onBlur={(e) => e.target.style.borderColor = "#d0d7e3"}
        />
      </div>

      {/* Extra Details */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "28px", gap: "40px" }}>
        <label style={{ minWidth: "200px", fontSize: "14px", fontWeight: "600", color: "#2c3e50" }}>
          Extra Details
        </label>
        <input
          type="text"
          value={productForm.extraDetails}
          onChange={(e) => setProductForm({ ...productForm, extraDetails: e.target.value })}
          style={{ flex: 1, padding: "10px 14px", border: "1px solid #d0d7e3", borderRadius: "6px", fontSize: "14px", color: "#333", outline: "none" }}
          onFocus={(e) => e.target.style.borderColor = "#1a2a4a"}
          onBlur={(e) => e.target.style.borderColor = "#d0d7e3"}
        />
      </div>

      {/* Product Image */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "40px", gap: "40px" }}>
        <label style={{ minWidth: "200px", fontSize: "14px", fontWeight: "600", color: "#2c3e50" }}>
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProductForm({ ...productForm, productImage: e.target.files[0] })}
          style={{ flex: 1, padding: "6px 0", fontSize: "14px", color: "#333" }}
        />
      </div>

      {/* Buttons */}
      <div>
        <button
          onClick={handleSaveProduct}
          style={{
            background: "#1a2a4a", color: "white", border: "none",
            padding: "12px 40px", borderRadius: "6px", fontSize: "15px",
            fontWeight: "600", cursor: "pointer", transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#243860"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#1a2a4a"}
        >
          Submit
        </button>
        <button
          onClick={() => setProductForm({ productType: '', partNumber: '', manufacturerName: '', productDescription: '', extraDetails: '', productImage: null })}
          style={{
            background: "#6c757d", color: "white", border: "none",
            padding: "12px 40px", borderRadius: "6px", fontSize: "15px",
            fontWeight: "600", cursor: "pointer", marginLeft: "12px"
          }}
        >
          Reset
        </button>
      </div>
    </div>
  </div>
)}
          {activeOrdersPage === "product-management-list" && (
  <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
    <style>{`
      @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      .pm-row:hover { box-shadow: -3px 0 0 #1a2a4a !important; background: linear-gradient(90deg, #eef2ff 0%, #f8f9ff 100%) !important; }
      .action-btn { transition: all 0.15s ease; border: none; cursor: pointer; }
      .edit-btn:hover { background: #3b82f6 !important; color: white !important; transform: translateY(-1px); }
      .del-btn:hover { background: #ef4444 !important; color: white !important; transform: translateY(-1px); }
      .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
    `}</style>

    {/* Header */}
    <div style={{ background: "linear-gradient(135deg, #1a2a4a 0%, #2d4a8a 100%)", padding: "32px 32px 80px", position: "relative", overflow: "hidden", animation: "fadeSlideIn 0.4s ease" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em", display: "inline-block", marginBottom: "10px" }}>PRODUCT MANAGEMENT</span>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>Product List</h1>
          <p style={{ margin: "6px 0 0", fontSize: "15px", color: "rgba(255,255,255,0.75)" }}>Manage all your products</p>
        </div>
        {hasPermission('product-create') && (
<button
  onClick={() => { 
    setProductForm({ productType: '', partNumber: '', manufacturerName: '', productDescription: '', extraDetails: '', productImage: null }); 
    setActiveOrdersPage('product-management-create'); 
  }}
  style={{ background: "white", color: "#1a2a4a", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
>
  <span style={{ fontSize: "18px" }}>+</span> Add Product
</button>
)}
      </div>
    </div>

    {/* Stats Cards */}
    <div style={{ padding: "0 32px", marginTop: "-44px", position: "relative", zIndex: 10, animation: "fadeSlideIn 0.5s ease 0.1s both" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {[
          { label: "Total Products", value: products.length, icon: "📦", color: "#1a2a4a", light: "#eef2ff" },
          { label: "Hardware", value: products.filter(p => p.product_type === 'hardware').length, icon: "🖥️", color: "#0f766e", light: "#ecfdf5" },
          { label: "Software", value: products.filter(p => p.product_type === 'software').length, icon: "💾", color: "#3b82f6", light: "#eff6ff" },
          { label: "Services", value: products.filter(p => p.product_type === 'services').length, icon: "⚙️", color: "#f59e0b", light: "#fffbeb" },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ background: "white", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: stat.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: "30px", fontWeight: "800", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px", fontWeight: "500" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Table */}
    <div style={{ padding: "24px 32px 32px", animation: "fadeSlideIn 0.5s ease 0.2s both" }}>
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Show</span>
            <select
              value={productEntriesPerPage}
              onChange={(e) => { setProductEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "white" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>entries</span>
            <span style={{ marginLeft: "8px", background: "#eef2ff", color: "#1a2a4a", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
              {filteredProducts.length} records
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={productSearchTerm}
              onChange={(e) => { setProductSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ padding: "9px 14px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "13px", width: "240px", color: "#374151", outline: "none" }}
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>No Products Yet</div>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "6px" }}>Click "Add Product" to create your first product</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                    {["#", "Product Type", "Part Number", "Manufacturer", "Description", "Extra Details", "Image", "Actions"].map((h, i) => (
                      <th key={i} style={{ padding: "13px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.slice(
  (currentPage - 1) * productEntriesPerPage,
  currentPage * productEntriesPerPage
).map((product, idx) => (
                    <tr key={product.id} className="pm-row" style={{ borderBottom: "1px solid #f9fafb", transition: "all 0.18s ease" }}>
                      <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151", fontWeight: "700" }}>
  {String((currentPage - 1) * productEntriesPerPage + idx + 1).padStart(2, '0')}
</td>
                      <td style={{ padding: "14px 16px" }}>
                        {product.product_type ? (
                          <span style={{
                            background: product.product_type === 'hardware' ? '#ecfdf5' : product.product_type === 'software' ? '#eff6ff' : '#fffbeb',
                            color: product.product_type === 'hardware' ? '#065f46' : product.product_type === 'software' ? '#1e40af' : '#92400e',
                            padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize",
                            border: `1px solid ${product.product_type === 'hardware' ? '#6ee7b7' : product.product_type === 'software' ? '#bfdbfe' : '#fcd34d'}`
                          }}>
                            {product.product_type}
                          </span>
                        ) : <span style={{ color: "#e5e7eb" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151", fontFamily: "monospace", fontWeight: "600" }}>
                        {product.part_number || <span style={{ color: "#e5e7eb", fontFamily: "sans-serif" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151" }}>
                        {product.manufacturer_name || <span style={{ color: "#e5e7eb" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={product.product_description || ''}>
                        {product.product_description || <span style={{ color: "#e5e7eb" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={product.extra_details || ''}>
                        {product.extra_details || <span style={{ color: "#e5e7eb" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {product.product_image ? (
                          <img
                            src={product.product_image}
                            alt="product"
                            style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e5e7eb" }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📷</div>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                       {hasPermission('product-edit') && (
<button
  className="action-btn edit-btn"
  onClick={() => {
    setProductForm({
      id: product.id,
      productType: product.product_type || '',
      partNumber: product.part_number || '',
      manufacturerName: product.manufacturer_name || '',
      productDescription: product.product_description || '',
      extraDetails: product.extra_details || '',
      productImage: null
    });
    setEditingProductId(product.id);
    setActiveOrdersPage('product-management-create');
  }}
  style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", marginRight: "6px" }}
>
  ✏️ Edit
</button>
)}
                        {hasPermission('product-delete') && (
                        <button
                          className="action-btn del-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}
                        >
                          🗑️
                        </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          

            {/* Pagination */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Showing <strong style={{ color: "#1f2937" }}>{Math.min(productEntriesPerPage, filteredProducts.length)}</strong> of <strong style={{ color: "#1f2937" }}>{filteredProducts.length}</strong> entries
              </span>
              <div style={{ display: "flex", gap: "4px" }}>
  <button
    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
    disabled={currentPage === 1}
    style={{
      padding: "7px 14px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      background: "white",
      color: currentPage === 1 ? "#d1d5db" : "#6b7280",
      cursor: currentPage === 1 ? "not-allowed" : "pointer",
      fontSize: "13px"
    }}
  >
    ← Prev
  </button>

  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      style={{
        padding: "7px 14px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        background: page === currentPage ? "linear-gradient(135deg,#1a2a4a,#2d4a8a)" : "white",
        color: page === currentPage ? "white" : "#6b7280",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: page === currentPage ? "700" : "400"
      }}
    >
      {page}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
    disabled={currentPage === totalPages}
    style={{
      padding: "7px 14px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      background: "white",
      color: currentPage === totalPages ? "#d1d5db" : "#6b7280",
      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
      fontSize: "13px"
    }}
  >
    Next →
  </button>
</div>

            </div>
          </>
        )}
      </div>
    </div>
  </div>
        )}

{activeOrdersPage === "manufacturer-create" && 
 (hasPermission('manufacturer-create') || hasPermission('manufacturer-edit')) && (
  <div>
     <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
      <button
        onClick={() => setActiveOrdersPage('manufacturer-list')}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#1a2a4a", display: "flex", alignItems: "center", gap: "6px", padding: "0" }}
      >
        ← Back
      </button>
      <h1 style={{ margin: 0, color: "#2c3e50" }}>
      
      </h1>
    </div>
    <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>Add Manufacturer</h1>
    <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Name</label>
          <input
            type="text"
            value={manufacturerForm.name}
            onChange={(e) => setManufacturerForm({ ...manufacturerForm, name: e.target.value })}
            placeholder="Enter manufacturer name"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "12px", color: "#666" }}>Type of Product</label>
          <select
            value={manufacturerForm.productType}
            onChange={(e) => setManufacturerForm({ ...manufacturerForm, productType: e.target.value })}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
          >
            <option value="">Select Type of Product</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="services">Services</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleSaveManufacturer}
          style={{ background: "#1a2a4a", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
        >
          Submit
        </button>
        <button
          onClick={() => setManufacturerForm({ name: '', productType: '' })}
          style={{ background: "#6c757d", color: "white", border: "none", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
        >
          Reset
        </button>
      </div>
    </div>
  </div>
)}
{activeOrdersPage === "manufacturer-list" && (
  <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>

    {/* Header */}
    <div style={{ background: "linear-gradient(135deg, #1a2a4a 0%, #2d4a8a 100%)", padding: "32px 32px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em", display: "inline-block", marginBottom: "10px" }}>MANUFACTURER</span>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>Manufacturer Lists</h1>
          <p style={{ margin: "6px 0 0", fontSize: "15px", color: "rgba(255,255,255,0.75)" }}>Manage all your manufacturers</p>
        </div>
        {hasPermission('manufacturer-create') && (
  <button
    onClick={() => { setManufacturerForm({ name: '', productType: '' }); setActiveOrdersPage('manufacturer-create'); }}
    style={{ background: "white", color: "#1a2a4a", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
  >
    <span style={{ fontSize: "18px" }}>+</span> Add Manufacturer
  </button>
)}
      </div>
    </div>

    {/* Table Card */}
    <div style={{ padding: "0 32px 32px", marginTop: "-44px", position: "relative", zIndex: 10 }}>
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Show</span>
            <select
              value={manufacturerEntriesPerPage}
            onChange={(e) => {setManufacturerEntriesPerPage(Number(e.target.value)); setManufacturerCurrentPage(1); }}
              style={{ padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "white" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>entries</span>
            <span style={{ marginLeft: "8px", background: "#eef2ff", color: "#1a2a4a", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
              {filteredManufacturers.length} records
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search manufacturers..."
              value={manufacturerSearchTerm}
              onChange={(e) => setManufacturerSearchTerm(e.target.value)}
              style={{ padding: "9px 14px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "13px", width: "240px", color: "#374151", outline: "none" }}
            />
          </div>
        </div>

        {/* Table */}
        {filteredManufacturers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏭</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>No Manufacturers Yet</div>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "6px" }}>Click "Add Manufacturer" to create your first manufacturer</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                    {["S No.", "Name", "Product Type", "Action"].map((h, i) => (
                      <th key={i} style={{ padding: "13px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredManufacturers.slice(
  (manufacturerCurrentPage - 1) * manufacturerEntriesPerPage,
  manufacturerCurrentPage * manufacturerEntriesPerPage
).map((m, idx) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid #f9fafb", transition: "all 0.18s ease" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8f9ff"}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}
                    >
                      <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151", fontWeight: "700" }}>{idx + 1}</td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#374151", fontWeight: "500" }}>{m.name || <span style={{ color: "#e5e7eb" }}>—</span>}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {m.productType ? (
                          <span style={{
                            background: m.productType === 'hardware' ? '#ecfdf5' : m.productType === 'software' ? '#eff6ff' : '#fffbeb',
                            color: m.productType === 'hardware' ? '#065f46' : m.productType === 'software' ? '#1e40af' : '#92400e',
                            padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize",
                            border: `1px solid ${m.productType === 'hardware' ? '#6ee7b7' : m.productType === 'software' ? '#bfdbfe' : '#fcd34d'}`
                          }}>
                            {m.productType}
                          </span>
                        ) : <span style={{ color: "#e5e7eb" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                       {hasPermission('manufacturer-edit') && (
<button
  onClick={() => {
    setManufacturerForm({ id: m.id, name: m.name, productType: m.productType });
    setActiveOrdersPage('manufacturer-create');
  }}
  style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", marginRight: "6px", cursor: "pointer" }}
>
  ✏️ Edit
</button>
)}

{hasPermission('manufacturer-delete') && (
<button
  onClick={async () => {
    if (window.confirm(`Delete manufacturer "${m.name}"?`)) {
      try {
        await axios.delete(`http://localhost:8081/manufacturers/${m.id}`);
        addActivityLog("Deleted", "Manufacturer", `Manufacturer deleted — Name: ${m.name}, Type: ${m.productType}`);
        alert("✅ Manufacturer deleted!");
        fetchManufacturers();
      } catch (error) {
        alert(`❌ Failed to delete: ${error.response?.data?.error || error.message}`);
      }
    }
  }}
  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "7px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
>
  🗑️
</button>
)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Showing <strong>{Math.min(manufacturerEntriesPerPage, filteredManufacturers.length)}</strong> of <strong>{filteredManufacturers.length}</strong> entries
              </span>
              <div style={{ display: "flex", gap: "4px" }}>
                {(() => {
  const total = Math.ceil(filteredManufacturers.length / manufacturerEntriesPerPage) || 1; // ✅
  return (
    <>
      <button
        onClick={() => setManufacturerCurrentPage(p => Math.max(1, p - 1))}   // ✅
        disabled={manufacturerCurrentPage === 1}                                // ✅
        style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px",
          background:"white",
          color: manufacturerCurrentPage === 1 ? "#d1d5db" : "#6b7280",
          cursor: manufacturerCurrentPage === 1 ? "not-allowed" : "pointer",
          fontSize:"13px" }}>
        ← Prev
      </button>

      {Array.from({ length: total }, (_, i) => i + 1).map(page => (
        <button key={page}
          onClick={() => setManufacturerCurrentPage(page)}                      // ✅
          style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px",
            background: page === manufacturerCurrentPage                         // ✅
              ? "linear-gradient(135deg,#1a2a4a,#2d4a8a)"
              : "white",
            color: page === manufacturerCurrentPage ? "white" : "#6b7280",      // ✅
            cursor:"pointer", fontSize:"13px",
            fontWeight: page === manufacturerCurrentPage ? "700" : "400" }}>    // ✅
          {page}
        </button>
      ))}

      <button
        onClick={() => setManufacturerCurrentPage(p => Math.min(total, p + 1))} // ✅
        disabled={manufacturerCurrentPage === total}                              // ✅
        style={{ padding:"7px 14px", border:"1px solid #e5e7eb", borderRadius:"8px",
          background:"white",
          color: manufacturerCurrentPage === total ? "#d1d5db" : "#6b7280",
          cursor: manufacturerCurrentPage === total ? "not-allowed" : "pointer",
          fontSize:"13px" }}>
        Next →
      </button>
    </>
  );
})()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}

{/*activity Logs*/}
{activeOrdersPage === "activity-logs" && (
  <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>

    {/* Header */}
    <div style={{ background: "linear-gradient(135deg, #1a2a4a 0%, #2d4a8a 100%)", padding: "32px 32px 80px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em", display: "inline-block", marginBottom: "10px" }}>SYSTEM</span>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>Activity Logs</h1>
          <p style={{ margin: "6px 0 0", fontSize: "15px", color: "rgba(255,255,255,0.75)" }}>Track all changes and updates across the system</p>
        </div>
        <button
          onClick={() => { setActivityLogs([]); localStorage.removeItem('activityLogs'); }}
          style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
        >
          🗑️ Clear All Logs
        </button>
      </div>
    </div>

    {/* Stats Cards */}
    <div style={{ padding: "0 32px", marginTop: "-44px", position: "relative", zIndex: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {[
          { label: "Total Logs", value: activityLogs.length, icon: "📋", color: "#1a2a4a", light: "#eef2ff" },
          { label: "Created", value: activityLogs.filter(l => l.action === "Created").length, icon: "✅", color: "#065f46", light: "#ecfdf5" },
          { label: "Updated", value: activityLogs.filter(l => l.action === "Updated").length, icon: "✏️", color: "#1e40af", light: "#eff6ff" },
          { label: "Deleted", value: activityLogs.filter(l => l.action === "Deleted").length, icon: "🗑️", color: "#dc2626", light: "#fef2f2" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: stat.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: "30px", fontWeight: "800", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "3px", fontWeight: "500" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Table */}
    <div style={{ padding: "24px 32px 32px" }}>
      <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Toolbar */}
        <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
          <span style={{ background: "#eef2ff", color: "#1a2a4a", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
            {activityLogs.filter(l =>
              l.action?.toLowerCase().includes(activityLogSearch.toLowerCase()) ||
              l.module?.toLowerCase().includes(activityLogSearch.toLowerCase()) ||
              l.details?.toLowerCase().includes(activityLogSearch.toLowerCase()) ||
              l.performedBy?.toLowerCase().includes(activityLogSearch.toLowerCase())
            ).length} records
          </span>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>🔍</span>
            <input
              type="text"
              placeholder="Search logs..."
              value={activityLogSearch}
              onChange={(e) => setActivityLogSearch(e.target.value)}
              style={{ padding: "9px 14px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "13px", width: "240px", color: "#374151", outline: "none" }}
            />
          </div>
        </div>

        {activityLogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📋</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>No Activity Yet</div>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "6px" }}>Actions like creating orders, products and manufacturers will appear here</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: "2px solid #f3f4f6" }}>
                  {["#", "Action", "Module", "Details", "Performed By", "Date & Time"].map((h, i) => (
                    <th key={i} style={{ padding: "13px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
  {(() => {
    const filteredLogs = activityLogs.filter(l =>
      l.action?.toLowerCase().includes(activityLogSearch.toLowerCase()) ||
      l.module?.toLowerCase().includes(activityLogSearch.toLowerCase()) ||
      l.details?.toLowerCase().includes(activityLogSearch.toLowerCase()) ||
      (l.user_name || l.performedBy)?.toLowerCase().includes(activityLogSearch.toLowerCase())
    );

    return filteredLogs.map((log, idx) => (
      <tr key={log.id}
        style={{ borderBottom: "1px solid #f9fafb", transition: "all 0.18s ease" }}
        onMouseEnter={e => e.currentTarget.style.background = "#f8f9ff"}
        onMouseLeave={e => e.currentTarget.style.background = "white"}
      >
        {/* ✅ #1 = latest */}
        <td style={{ padding: "14px 16px", fontSize: "13px", color: "#d1d5db", fontWeight: "600" }}>
          {filteredLogs.length - idx}
        </td>

        {/* Action Badge */}
        <td style={{ padding: "14px 16px" }}>
          <span style={{
            background: log.action === "Created" ? "#ecfdf5" : log.action === "Updated" ? "#eff6ff" : "#fef2f2",
            color: log.action === "Created" ? "#065f46" : log.action === "Updated" ? "#1e40af" : "#dc2626",
            padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
            border: `1px solid ${log.action === "Created" ? "#6ee7b7" : log.action === "Updated" ? "#bfdbfe" : "#fecaca"}`,
            whiteSpace: "nowrap"
          }}>
            {log.action === "Created" ? "✅" : log.action === "Updated" ? "✏️" : "🗑️"} {log.action}
          </span>
        </td>

        {/* Module */}
        <td style={{ padding: "14px 16px" }}>
          <span style={{ background: "#f3f4f6", color: "#374151", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
            {log.module}
          </span>
        </td>

        {/* Details */}
<td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", maxWidth: "350px" }}>
  <div style={{ 
    whiteSpace: "normal", 
    wordBreak: "break-word", 
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  }} title={log.details}>
    {log.details}
  </div>
</td>

        {/* Performed By */}
        <td style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "linear-gradient(135deg, #1a2a4a, #2d4a8a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: "12px", fontWeight: "700", flexShrink: 0
            }}>
              {(log.user_name || log.performedBy)?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500", whiteSpace: "nowrap" }}>
              {log.user_name || log.performedBy || "Unknown"}
            </span>
          </div>
        </td>

        {/* Timestamp */}
        <td style={{ padding: "14px 16px", fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>
          {new Date(log.timestamp || log.created_at).toLocaleString()}
        </td>
      </tr>
    ));
  })()}
</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      
        {/* ✅ NORMAL USER WELCOME PAGE */}
{!showDashboard && !activeRolePanel && !activeOrdersPage && user && user?.role?.toUpperCase() !== "SUPERADMIN" && viewMode === null && (
  <div style={{ padding: "24px", background: "#f5f6fa", minHeight: "100vh" }}>

    {/* Welcome Banner */}
    <div style={{
      background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a9e 50%, #4a90d9 100%)",
      borderRadius: "16px", padding: "36px 40px", color: "white",
      marginBottom: "28px", display: "flex", alignItems: "center",
      justifyContent: "space-between", boxShadow: "0 8px 32px rgba(30,58,95,0.18)"
    }}>
      <div>
        <div style={{ fontSize: "13px", opacity: 0.75, marginBottom: "6px", letterSpacing: "1px" }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "30px", fontWeight: "800" }}>
          👋 Welcome back, {user?.name}!
        </h1>
        <p style={{ margin: "0 0 16px 0", opacity: 0.85, fontSize: "15px" }}>
          You are logged in as <strong>{user?.role}</strong>. Manage your orders efficiently.
        </p>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.18)",
          borderRadius: "20px", padding: "6px 16px", fontSize: "13px", fontWeight: "600"
        }}>
          📧 {user?.email}
        </div>
      </div>
      <div style={{ fontSize: "90px", opacity: 0.9 }}>🚀</div>
    </div>

    {/* Orders Summary Cards */}
    <h2 style={{ color: "#2c3e50", marginBottom: "16px", fontSize: "17px", fontWeight: "700" }}>
      📊 Orders Summary
    </h2>
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px", marginBottom: "28px"
    }}>
      {[
        { label: "Hardware Orders", icon: "🖥️", color: "#2196f3", bg: "#e3f2fd" },
        { label: "AV POS Orders",   icon: "📺", color: "#9c27b0", bg: "#f3e5f5" },
        { label: "HW & SW POs",     icon: "💾", color: "#f57c00", bg: "#fff3e0" },
        { label: "ITAR Orders",     icon: "📋", color: "#e91e63", bg: "#fce4ec" },
      ].map((item) => (
        <div key={item.label} style={{
          background: "white", borderRadius: "12px", padding: "22px 20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
          borderTop: `4px solid ${item.color}`, textAlign: "center"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>{item.icon}</div>
          <div style={{ fontWeight: "700", color: "#2c3e50", fontSize: "14px" }}>{item.label}</div>
        </div>
      ))}
    </div>

    {/* Quick Create */}
    <h2 style={{ color: "#2c3e50", marginBottom: "16px", fontSize: "17px", fontWeight: "700" }}>
      ⚡ Quick Create
    </h2>
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px", marginBottom: "28px"
    }}>
      {[
        { label: "New Hardware Order", icon: "🖥️", color: "#2196f3" },
        { label: "New AV POS Order",   icon: "📺", color: "#9c27b0" },
        { label: "New HW & SW PO",     icon: "💾", color: "#f57c00" },
        { label: "New ITAR Order",     icon: "📋", color: "#e91e63" },
      ].map((item) => (
        <div key={item.label} style={{
          background: "white", borderRadius: "12px", padding: "18px 20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
          borderLeft: `5px solid ${item.color}`,
          display: "flex", alignItems: "center", gap: "14px"
        }}>
          <div style={{
            width: "46px", height: "46px", borderRadius: "50%",
            background: `${item.color}18`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "22px", flexShrink: 0
          }}>{item.icon}</div>
          <div style={{ fontWeight: "700", color: "#2c3e50", fontSize: "14px" }}>{item.label}</div>
        </div>
      ))}
    </div>

    {/* Tips Section */}
    <h2 style={{ color: "#2c3e50", marginBottom: "16px", fontSize: "17px", fontWeight: "700" }}>
      💡 Tips for Getting Started
    </h2>
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px"
    }}>
      {[
        { icon: "📋", title: "Create Orders",  color: "#2196f3", bg: "#e3f2fd", desc: "Use Quick Create above or go to sidebar → Order Management → Orders to create any type of order." },
        { icon: "📦", title: "Track Products", color: "#4caf50", bg: "#e8f5e9", desc: "Go to Product Management in the sidebar to view and manage all available products and parts." },
        { icon: "🏭", title: "Manufacturers",  color: "#f57c00", bg: "#fff3e0", desc: "Find manufacturer details under the Manufacturer section inside Order Management." },
        { icon: "📊", title: "View Reports",   color: "#9c27b0", bg: "#f3e5f5", desc: "Each order type has a Report section to see your complete order history and status." },
        { icon: "🎯", title: "User Activity",  color: "#e91e63", bg: "#fce4ec", desc: "Track all your actions and activity logs from the User Activity section in the sidebar." },
        { icon: "🔍", title: "Search Orders",  color: "#00bcd4", bg: "#e0f7fa", desc: "Use the search bar inside each order list to quickly find any order by name, number, or status." },
      ].map((tip) => (
        <div key={tip.title} style={{
          background: "white", borderRadius: "12px", padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)", display: "flex",
          gap: "14px", alignItems: "flex-start", borderTop: `3px solid ${tip.color}`
        }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "10px", background: tip.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", flexShrink: 0
          }}>{tip.icon}</div>
          <div>
            <div style={{ fontWeight: "700", color: tip.color, fontSize: "14px", marginBottom: "6px" }}>{tip.title}</div>
            <div style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>{tip.desc}</div>
          </div>
        </div>
      ))}
    </div>

  </div>
)}


{/* TABLE VIEW */}
{!showDashboard && !activeRolePanel && !activeOrdersPage && 
 (viewMode === "profiles" || viewMode === "owners" || 
  (user?.role?.toUpperCase() === "SUPERADMIN" && viewMode === "all")) && (
<div>
  <div style={{
    background: "white", padding: "20px",
    borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px", display: "flex",
    justifyContent: "space-between", alignItems: "center"
  }}>
    <h1 style={{ margin: 0, color: "#2c3e50" }}>
      {viewMode === "owners" ? "All Owners" : 
       viewMode === "profiles" ? "All Profiles" : 
       "Manage Users"}
    </h1>
    {(viewMode === "owners" || viewMode === "profiles") && (
      <button
        onClick={() => {
          if (user?.role?.toUpperCase() === "SUPERADMIN") {
            setViewMode("all");
          } else {
            setViewMode(null);
            setShowManageUsersDropdown(false);
          }
        }}
        style={{
          background: "#2196f3", color: "white", border: "none",
          padding: "8px 18px", borderRadius: "4px",
          cursor: "pointer", fontSize: "14px", fontWeight: "600"
        }}
      >
        ← BACK
      </button>
    )}
  </div>

  <div style={{
    background: "white", padding: "20px",
    borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }}>
    <div style={{ marginBottom: "15px" }}>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "8px 12px", border: "1px solid #ddd",
          borderRadius: "4px", fontSize: "14px", width: "300px"
        }}
      />
    </div>

    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f9fa" }}>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontSize: "12px", color: "#2c3e50", fontWeight: "600" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontSize: "12px", color: "#2c3e50", fontWeight: "600" }}>NAME</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontSize: "12px", color: "#2c3e50", fontWeight: "600" }}>EMAIL</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontSize: "12px", color: "#2c3e50", fontWeight: "600" }}>USERNAME</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontSize: "12px", color: "#2c3e50", fontWeight: "600" }}>PHONE</th>
            {/* OWNER column sirf SUPERADMIN ko */}
            {user?.role?.toUpperCase() === "SUPERADMIN" && viewMode === "all" && (
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontSize: "12px", color: "#2c3e50", fontWeight: "600" }}>OWNER</th>
            )}
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontSize: "12px", color: "#2c3e50", fontWeight: "600" }}>ROLE</th>
            <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6", fontSize: "12px", color: "#2c3e50", fontWeight: "600" }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((profile, idx) => (
            <tr key={profile.id} style={{ borderBottom: "1px solid #dee2e6" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8f9fa"}
              onMouseLeave={e => e.currentTarget.style.background = "white"}
            >
              <td style={{ padding: "12px", fontSize: "14px" }}>{idx + 1}</td>
              <td style={{ padding: "12px", fontSize: "14px" }}>
                {profile.name}
                {profile.parent_id && (
                  <span style={{ background: "#17a2b8", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "3px", marginLeft: "6px" }}>CHILD</span>
                )}
              </td>
              <td style={{ padding: "12px", fontSize: "14px" }}>{profile.email}</td>
              <td style={{ padding: "12px", fontSize: "14px" }}>{profile.username || "—"}</td>
              <td style={{ padding: "12px", fontSize: "14px" }}>{profile.phone}</td>

              {/* OWNER column sirf SUPERADMIN ko */}
              {user?.role?.toUpperCase() === "SUPERADMIN" && viewMode === "all" && (
                <td style={{ padding: "12px", fontSize: "14px" }}>
                  {profile.parent_id ? `👤 ${getOwnerName(profile)}` : "👑 Self (Owner)"}
                </td>
              )}

              <td style={{ padding: "12px" }}>
                <span style={{
                  background: "#6c757d", color: "white",
                  padding: "3px 8px", borderRadius: "3px",
                  fontSize: "11px", fontWeight: "600"
                }}>
                  {profile.role?.toUpperCase() || "USER"}
                </span>
              </td>

              <td style={{ padding: "12px" }}>
  {/* EDIT - sirf user-edit permission ho toh */}
  {hasPermission('user-edit') && (
    <button
      onClick={() => handleEditProfile(profile)}
      style={{ background: "#f0ad4e", color: "white", border: "none", padding: "5px 12px", borderRadius: "3px", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "6px" }}>
      EDIT
    </button>
  )}

  {/* DELETE - sirf user-delete permission ho toh */}
  {hasPermission('user-delete') && (
    <button
      onClick={() => handleDelete(profile.id)}
      style={{ background: "#dc3545", color: "white", border: "none", padding: "5px 12px", borderRadius: "3px", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "6px" }}>
      DELETE
    </button>
  )}

  {/* VIEW - sirf user-list permission ho toh */}
  {hasPermission('user-list') && (
    <button
      onClick={() => setSelectedProfileView(profile)}
      style={{ background: "#17a2b8", color: "white", border: "none", padding: "5px 12px", borderRadius: "3px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
      VIEW
    </button>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  </div>
</div>
)}
      </div>

      {/* ROLE MANAGEMENT SIDEBAR */}
      {activeRolePanel && (
        <div style={{
          width: "1350px",
          backgroundColor: "white",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
          overflowY: "auto",
          borderLeft: "1px solid #e0e0e0"
        }}>
          {/* ROLE LIST PANEL */}
          {activeRolePanel === "list" && (
            <div style={{ padding: "30px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}>
                <h2 style={{ color: "#2c3e50", margin: 0 }}>📋 Role List</h2>
                <button
                  onClick={() => setActiveRolePanel(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ×
                </button>
              </div>

              {roles.length === 0 ? (
                <div style={{
                  background: "#f5f5f5",
                  padding: "40px",
                  borderRadius: "8px",
                  textAlign: "center",
                  color: "#999"
                }}>
                  No roles created yet. Click "Add Role" to create one.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      style={{
                        background: "#f8f9fa",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        padding: "15px"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "10px"
                      }}>
                        <div>
                          <h3 style={{
                            margin: 0,
                            marginBottom: "5px",
                            color: "#2c3e50",
                            fontSize: "16px",
                            fontWeight: "600"
                          }}>
                            {role.role_name}
                          </h3>
                          <div style={{ fontSize: "11px", color: "#999" }}>
                            Created by: {role.creator_name || 'Unknown'}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
  {/* EDIT - sirf role-edit ya user-edit permission ho toh */}
  {hasAnyPermission(['role-edit', 'user-edit']) && (
    <button
      onClick={() => handleEditRole(role)}
      style={{
        background: "#f0ad4e",
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600"
      }}
    >
      ✏️ Edit
    </button>
  )}

  {/* DELETE - sirf role-delete ya user-delete permission ho toh */}
  {hasAnyPermission(['role-delete', 'user-delete']) && (
    <button
      onClick={() => {
        if (window.confirm(`Delete role "${role.role_name}"?`)) {
          axios.delete(`http://localhost:8081/roles/${role.id}`)
            .then(() => {
              alert("✅ Role deleted!");
              addActivityLog("Deleted", "Role Management", `Role deleted — Name: ${role.role_name}`);
              fetchRoles();
            })
            .catch((err) => {
              alert("❌ Failed to delete role");
              console.error(err);
            });
        }
      }}
      style={{
        background: "#d9534f",
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600"
      }}
    >
      🗑️ Delete
    </button>
  )}

  {/* Agar dono nahi hain toh kuch bhi nahi dikhega */}
</div>
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <div style={{
                          fontSize: "11px",
                          color: "#666",
                          marginBottom: "5px",
                          fontWeight: "600"
                        }}>
                          Permissions ({role.permissions.length}):
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {role.permissions.slice(0, 5).map((perm, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: "#e8f5e9",
                                color: "#2e7d32",
                                padding: "3px 8px",
                                borderRadius: "3px",
                                fontSize: "10px",
                                fontWeight: "600"
                              }}
                            >
                              {perm}
                            </span>
                          ))}
                          {role.permissions.length > 5 && (
                            <span style={{
                              color: "#666",
                              fontSize: "10px",
                              padding: "3px 8px"
                            }}>
                              +{role.permissions.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADD ROLE PANEL */}
          {activeRolePanel === "add" && hasPermission('role-create') && (
  <div style={{ padding: "30px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}>
                <h2 style={{ color: "#2c3e50", margin: 0 }}>➕ Add Role</h2>
                <button
                  onClick={() => setActiveRolePanel(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: "20px" }}>
  <label style={{
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#2c3e50"
  }}>
    Role Name *
  </label>
  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
   <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
  <select
    value={newRoleName}
    onChange={(e) => setNewRoleName(e.target.value)}
    style={{
      flex: 1,
      padding: "12px",
      width: "543px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "14px",
      background: "white",
      cursor: "pointer"
    }}
  >
    <option value="">-- Select Role --</option>
    <option value="USER">USER</option>
    <option value="ADMIN">ADMIN</option>
    <option value="SUPERADMIN">SUPER ADMIN</option>
    <option value="MANAGER">MANAGER</option>
    <option value="EMPLOYEE">EMPLOYEE</option>
    <option value="CONTRACTOR">CONTRACTOR</option>
    {roles
      .filter(r => !["USER","ADMIN","SUPERADMIN","MANAGER","EMPLOYEE","CONTRACTOR"].includes(r.role_name.toUpperCase()))
      .map(r => (
        <option key={r.id} value={r.role_name}>{r.role_name}</option>
      ))
    }
  </select>
  <button
    type="button"
    onClick={() => {
      setQuickRoleName("");
      setQuickRolePermissions([]);
      setShowQuickAddRoleModal(true);
    }}
    title="Add New Custom Role"
    style={{
      padding: "12px 16px",
      background: "#5cb85c",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "22px",
      fontWeight: "700",
      lineHeight: 1
    }}
  >
    +
  </button>
</div>
   
  </div>
</div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "12px", fontWeight: "600", color: "#2c3e50" }}>
                  Management Permissions *
                </label>
                <div style={{
  maxHeight: "400px",
  overflowY: "auto",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "10px",
  width: "600px"
}}>
  {managementPermissions.map((permission) => (
    <div
      key={permission}
      onClick={() => toggleManagementPermission(permission)}
      style={{
        padding: "10px",
        marginBottom: "5px",
        borderRadius: "4px",
        cursor: "pointer",
        background: selectedManagementPermissions.includes(permission) ? "#e8f5e9" : "white",
        border: `1px solid ${selectedManagementPermissions.includes(permission) ? "#4caf50" : "#e0e0e0"}`,
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => {
        if (!selectedManagementPermissions.includes(permission)) {
          e.currentTarget.style.background = "#f5f5f5";
        }
      }}
      onMouseLeave={(e) => {
        if (!selectedManagementPermissions.includes(permission)) {
          e.currentTarget.style.background = "white";
        }
      }}
    >
      <input
        type="checkbox"
        checked={selectedManagementPermissions.includes(permission)}
        onChange={() => {}}
        style={{ width: "16px", height: "16px", cursor: "pointer", pointerEvents: "none" }}
      />
      <span style={{ marginLeft: "10px", fontSize: "14px" }}>{permission}</span>
    </div>
  ))}
</div>
                <div style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "8px",
                  fontStyle: "italic"
                }}>
                  {selectedManagementPermissions.length === 0
                    ? "No permissions selected"
                    : `${selectedManagementPermissions.length} permission(s) selected`
                  }
                </div>
              </div>

              <div style={{ display: "flex", width: "600px", gap: "10px" }}>
                <button
                  onClick={saveRole}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    background: "#f57c00",
                    
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#e65100"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#f57c00"}
                >
                  💾 Save Role
                </button>
                <button
                  onClick={() => {
                    setNewRoleName("");
                    setSelectedManagementPermissions([]);
                  }}
                  style={{
                    padding: "12px 24px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* View Profile Modal */}
    {selectedProfileView && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
        <div style={{
          background: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto"
        }}>
          <div style={{
            background: "#2196f3",
            color: "white",
            padding: "20px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h2 style={{ margin: 0 }}>👁️ View Profile Details</h2>
            <button
              onClick={() => setSelectedProfileView(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: "30px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#666", fontSize: "12px" }}>Name</label>
              <div style={{ padding: "12px", background: "#f5f5f5", borderRadius: "4px", fontSize: "14px" }}>
                {selectedProfileView.name}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#666", fontSize: "12px" }}>Email</label>
              <div style={{ padding: "12px", background: "#f5f5f5", borderRadius: "4px", fontSize: "14px" }}>
                {selectedProfileView.email}
              </div>
              
            </div>
            <div style={{ marginBottom: "20px" }}>
  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#666", fontSize: "12px" }}>Username</label>
  <div style={{ padding: "12px", background: "#f5f5f5", borderRadius: "4px", fontSize: "14px" }}>
    {selectedProfileView.username || "Not set"}
  </div>
</div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#666", fontSize: "12px" }}>Phone</label>
              <div style={{ padding: "12px", background: "#f5f5f5", borderRadius: "4px", fontSize: "14px" }}>
                {selectedProfileView.phone || "N/A"}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#666", fontSize: "12px" }}>Role</label>
              <div style={{ padding: "12px", background: "#f5f5f5", borderRadius: "4px", fontSize: "14px" }}>
                <span style={{
                  background: "#2196f3",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  {(selectedProfileView.role || "user").toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#666", fontSize: "12px" }}>Owner</label>
              <div style={{ padding: "12px", background: "#f5f5f5", borderRadius: "4px", fontSize: "14px" }}>
                {selectedProfileView.parent_id ? (
                  <span>👶 {data.find(p => p.id === selectedProfileView.parent_id)?.name || "Unknown"}</span>
                ) : (
                  <span>👑 Self (Owner)</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedProfileView(null)}
              style={{
                background: "#2196f3",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Profile Modal */}
    {showEditModal && editingProfile && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
        <div style={{
          background: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto"
        }}>
          <div style={{
            background: "#f0ad4e",
            color: "white",
            padding: "20px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h2 style={{ margin: 0 }}>✏️ Edit Profile</h2>
            <button
              onClick={() => setShowEditModal(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: "30px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Name *</label>
              <input
                type="text"
                value={editingProfile.name}
                onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Email *</label>
              <input
                type="email"
                value={editingProfile.email}
                onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Username (optional)</label>
  <input
    type="text"
    value={editingProfile.username || ''}
    onChange={(e) => setEditingProfile({ ...editingProfile, username: e.target.value })}
    style={{
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px"
    }}
  />
</div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Phone *</label>
              <input
                type="tel"
                value={editingProfile.phone}
                onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Role *</label>
              <select
                value={editingProfile.role}
                onChange={(e) => {
  const selectedRoleName = e.target.value;
  const selectedRole = roles.find(r => r.role_name.toUpperCase() === selectedRoleName.toUpperCase());

  setEditingProfile({
    ...editingProfile,
    role: selectedRoleName.toUpperCase(),
    permissions: selectedRole ? selectedRole.permissions : []
  });
}}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              >
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.role_name}>
                    {role.role_name} ({role.permissions.length} permissions)
                  </option>
                ))}
              </select>

              {editingProfile.role && (
  <div style={{
    marginTop: "10px",
    padding: "10px",
    background: "#f8f9fa",
    borderRadius: "4px"
  }}>
    <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "#666" }}>
      Assigned Permissions: {/* ✅ Role ki actual permissions dikhao */}
      <span style={{ color: "#2196f3", marginLeft: "6px" }}>
        ({roles.find(r => r.role_name.toUpperCase() === editingProfile.role.toUpperCase())?.permissions?.length || 0} total)
      </span>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
      {/* ✅ editingProfile.permissions ki jagah role ki actual permissions use karo */}
      {(roles.find(r => r.role_name.toUpperCase() === editingProfile.role.toUpperCase())?.permissions || []).map((perm, idx) => (
        <span
          key={idx}
          style={{
            background: "#e8f5e9",
            color: "#2e7d32",
            padding: "3px 8px",
            borderRadius: "3px",
            fontSize: "10px",
            fontWeight: "600"
          }}
        >
          {perm}
        </span>
      ))}
    </div>
  </div>
)}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                style={{
                  background: "#f0ad4e",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                💾 Update
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Add User Modal */}
    {showAddModal && (
  <div style={{
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  }}>
    <div style={{
      background: "white",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "90vh",
      overflow: "auto"
    }}>
      {/* Header */}
      <div style={{
        background: "#5cb85c",
        color: "white",
        padding: "20px",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ margin: 0 }}>➕ Add New User</h2>
        <button
          onClick={() => {
  setShowAddModal(false);
  setShowCountryDropdown(false);
  setCountrySearchTerm("");
}}
          style={{
            background: "transparent", border: "none",
            color: "white", fontSize: "24px", cursor: "pointer"
          }}
        >×</button>
      </div>

      <div style={{ padding: "30px" }}>

        {/* Name */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Name *</label>
          <input
            type="text"
            value={newProfile.name}
            onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
            placeholder="Enter full name"
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        {/* Username */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Username <span style={{ fontWeight: "400", color: "#999", fontSize: "12px" }}>(optional)</span>
          </label>
          <input
            type="text"
            value={newProfile.username !== undefined ? newProfile.username : ""}
            onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })}
            placeholder="Enter username (optional)"
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Email *</label>
          <input
            type="email"
            value={newProfile.email}
            onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
            placeholder="Enter email address"
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        {/* Phone with Searchable Country Code */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Phone *</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>

            {/* Country Code Button + Dropdown */}
            <div style={{ position: "relative" }} className="country-dropdown-wrapper">
              <button
                type="button"
                onClick={() => {
                  setShowCountryDropdown(!showCountryDropdown);
                  setCountrySearchTerm("");
                }}
                style={{
                  padding: "9px 10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "13px",
                  background: "white",
                  cursor: "pointer",
                  minWidth: "155px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "6px",
                  height: "42px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
  <span style={{ fontSize: "20px" }}>
    {newProfileCountryCode?.flag || "🇺🇸"}
  </span>
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <span style={{ fontSize: "12px", fontWeight: "600", color: "#2c3e50", lineHeight: 1.2 }}>
      {newProfileCountryCode?.name || "United States"}
    </span>
    <span style={{ fontSize: "11px", color: "#888", lineHeight: 1.2 }}>
      {newProfileCountryCode?.code || "+1"}
    </span>
  </div>
</div>
                <span style={{ fontSize: "9px", color: "#888" }}>▼</span>
              </button>

              {/* Dropdown */}
              {showCountryDropdown && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  zIndex: 9999,
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  width: "280px",
                  maxHeight: "320px",
                  overflow: "hidden",
                  marginTop: "2px"
                }}>

                  {/* Search Input */}
                  <div style={{ padding: "8px", borderBottom: "1px solid #eee", background: "#fafafa" }}>
                    <input
                      type="text"
                      placeholder="🔍 Search country or code..."
                      value={countrySearchTerm}
                      onChange={(e) => setCountrySearchTerm(e.target.value)}
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Country List */}
                  <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                    {countryCodes
                      .filter(c =>
                        c.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                        c.code.includes(countrySearchTerm)
                      )
                      .map((country, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setNewProfileCountryCode(country);
                            setShowCountryDropdown(false);
                            setCountrySearchTerm("");
                          }}
                          style={{
                            padding: "10px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: newProfileCountryCode?.name === country.name ? "#e8f5e9" : "white",
                            borderBottom: "1px solid #f5f5f5",
                            transition: "background 0.1s"
                          }}
                          onMouseEnter={(e) => {
                            if (newProfileCountryCode !== country.code)
                              e.currentTarget.style.background = "#f0f4ff";
                          }}
                          onMouseLeave={(e) => {
  e.currentTarget.style.background =
    newProfileCountryCode?.name === country.name ? "#e8f5e9" : "white";
}}
                        >
                          <span style={{ fontSize: "22px" }}>{country.flag}</span>
                          <span style={{ flex: 1, fontSize: "13px", color: "#2c3e50" }}>{country.name}</span>
                          <span style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>{country.code}</span>
                          {newProfileCountryCode?.name === country.name && (
  <span style={{ color: "#5cb85c", fontSize: "14px" }}>✓</span>
)}
                        </div>
                      ))
                    }

                    {/* No results */}
                    {countryCodes.filter(c =>
                      c.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                      c.code.includes(countrySearchTerm)
                    ).length === 0 && (
                      <div style={{ padding: "20px", textAlign: "center", color: "#999", fontSize: "13px" }}>
                        😕 No country found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Phone Number Input */}
            <div style={{ flex: 1 }}>
              <input
                type="tel"
                value={newProfile.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) {
                    setNewProfile({ ...newProfile, phone: val });
                  }
                }}
                placeholder="10 digit number"
                maxLength={10}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${newProfile.phone && newProfile.phone.length !== 10 && newProfile.phone.length > 0 ? '#dc3545' : '#ddd'}`,
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Validation Message */}
          {newProfile.phone && newProfile.phone.length !== 10 && newProfile.phone.length > 0 && (
            <div style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}>
              ❌ Mobile number must be exactly 10 digits ({newProfile.phone.length}/10)
            </div>
          )}
          {newProfile.phone && newProfile.phone.length === 10 && (
            <div style={{ color: "#5cb85c", fontSize: "12px", marginTop: "5px" }}>
              ✅ {newProfileCountryCode?.flag} {newProfileCountryCode?.code} {newProfile.phone}
            </div>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Password *</label>
          <input
            type="password"
            value={newProfile.password}
            onChange={(e) => setNewProfile({ ...newProfile, password: e.target.value })}
            placeholder="Enter password"
            style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}
          />
        </div>

        {/* Role */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Role *</label>
          <select
            value={newProfile.role}
            onChange={(e) => {
              const selectedRoleName = e.target.value;
              const selectedRole = roles.find(r => r.role_name.toUpperCase() === selectedRoleName.toUpperCase());
              setNewProfile({
                ...newProfile,
                role: selectedRoleName.toUpperCase(),
                permissions: selectedRole ? selectedRole.permissions : []
              });
            }}
            style={{
              width: "100%", padding: "10px",
              border: "1px solid #ddd", borderRadius: "4px",
              fontSize: "14px", cursor: "pointer"
            }}
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.role_name}>
                {role.role_name} ({role.permissions.length} permissions)
              </option>
            ))}
          </select>

          {newProfile.role && (
            <div style={{ marginTop: "10px", padding: "10px", background: "#f8f9fa", borderRadius: "4px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "#666" }}>
                Assigned Permissions:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {roles.find(r => r.role_name.toUpperCase() === newProfile.role.toUpperCase())?.permissions.map((perm, idx) => (
                  <span key={idx} style={{
                    background: "#e8f5e9", color: "#2e7d32",
                    padding: "3px 8px", borderRadius: "3px",
                    fontSize: "10px", fontWeight: "600"
                  }}>
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowAddModal(false)}
            style={{
              background: "#6c757d", color: "white", border: "none",
              padding: "10px 20px", borderRadius: "4px",
              cursor: "pointer", fontSize: "14px"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAddProfile}
            style={{
              background: "#5cb85c", color: "white", border: "none",
              padding: "10px 20px", borderRadius: "4px",
              cursor: "pointer", fontSize: "14px", fontWeight: "600"
            }}
          >
            ✅ Add User
          </button>
        </div>

      </div>
    </div>
  </div>
)}

    {/* Edit Role Modal */}
    {showEditRoleModal && editingRole && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}>
        <div style={{
          background: "white",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "auto"
        }}>
          <div style={{
            background: "#f0ad4e",
            color: "white",
            padding: "20px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h2 style={{ margin: 0 }}>✏️ Edit Role</h2>
            <button
              onClick={() => {
                setShowEditRoleModal(false);
                setEditingRole(null);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: "30px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50" }}>
                Role Name *
              </label>
              <input
                type="text"
                value={editingRole.role_name}
                onChange={(e) => setEditingRole({ ...editingRole, role_name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "12px", fontWeight: "600", color: "#2c3e50" }}>
                Management Permissions *
              </label>
              <div style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "10px"
              }}>
                {managementPermissions.map((permission) => (
                  <div
                    key={permission}
                    style={{
                      padding: "10px",
                      marginBottom: "5px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      background: editingRole.permissions.includes(permission) ? "#e8f5e9" : "white",
                      border: `1px solid ${editingRole.permissions.includes(permission) ? "#4caf50" : "#e0e0e0"}`,
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      if (!editingRole.permissions.includes(permission)) {
                        e.currentTarget.style.background = "#f5f5f5";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!editingRole.permissions.includes(permission)) {
                        e.currentTarget.style.background = "white";
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editingRole.permissions.includes(permission)}
                      onChange={(e) => {
  const children = permissionChildren[permission] || [];
  if (e.target.checked) {
    // Parent + children sab add karo
    const toAdd = [permission, ...children].filter(
      p => !editingRole.permissions.includes(p)
    );
    setEditingRole({
      ...editingRole,
      permissions: [...editingRole.permissions, ...toAdd]
    });
  } else {
    // Parent + children sab remove karo
    setEditingRole({
      ...editingRole,
      permissions: editingRole.permissions.filter(
        p => p !== permission && !children.includes(p)
      )
    });
  }
}}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <span style={{ marginLeft: "10px", fontSize: "14px" }}>{permission}</span>
                  </div>
                ))}
              </div>
              <div style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "8px",
                fontStyle: "italic"
              }}>
                {editingRole.permissions.length === 0
                  ? "No permissions selected"
                  : `${editingRole.permissions.length} permission(s) selected`
                }
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setShowEditRoleModal(false);
                  setEditingRole(null);
                }}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                style={{
                  background: "#f0ad4e",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                💾 Update Role
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Quick Add Role Modal */}
{showQuickAddRoleModal && (
  <div style={{
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 2000
  }}>
    <div style={{
      background: "white", borderRadius: "8px",
      width: "90%", maxWidth: "600px", maxHeight: "90vh", overflow: "auto"
    }}>
      <div style={{
        background: "#5cb85c", color: "white", padding: "20px",
        borderTopLeftRadius: "8px", borderTopRightRadius: "8px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <h2 style={{ margin: 0 }}>➕ Add New Role</h2>
        <button onClick={() => setShowQuickAddRoleModal(false)}
          style={{ background: "transparent", border: "none", color: "white", fontSize: "24px", cursor: "pointer" }}>
          ×
        </button>
      </div>

      <div style={{ padding: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2c3e50" }}>
            Role Name *
          </label>
          <input
            type="text"
            value={quickRoleName}
            onChange={(e) => setQuickRoleName(e.target.value.toUpperCase())}
            placeholder="e.g. SUPERVISOR"
            style={{
              width: "100%", padding: "12px",
              border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontWeight: "600", color: "#2c3e50" }}>
            Permissions * ({quickRolePermissions.length} selected)
          </label>
          <div style={{
            maxHeight: "300px", overflowY: "auto",
            border: "1px solid #ddd", borderRadius: "4px", padding: "10px"
          }}>
            {managementPermissions.map((permission) => (
              <div
                key={permission}
                style={{
                  padding: "10px", marginBottom: "5px", borderRadius: "4px",
                  cursor: "pointer",
                  background: quickRolePermissions.includes(permission) ? "#e8f5e9" : "white",
                  border: `1px solid ${quickRolePermissions.includes(permission) ? "#4caf50" : "#e0e0e0"}`
                }}
              >
                <input
                  type="checkbox"
                  checked={quickRolePermissions.includes(permission)}
                  onChange={() => {
                    setQuickRolePermissions(prev =>
                      prev.includes(permission)
                        ? prev.filter(p => p !== permission)
                        : [...prev, permission]
                    );
                  }}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <span style={{ marginLeft: "10px", fontSize: "14px" }}>{permission}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowQuickAddRoleModal(false)}
            style={{
              background: "#6c757d", color: "white", border: "none",
              padding: "10px 20px", borderRadius: "4px", cursor: "pointer", fontSize: "14px"
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (!quickRoleName.trim()) {
                alert("❌ Role name is required!");
                return;
              }
              try {
                await axios.post("http://localhost:8081/roles", {
                  role_name: quickRoleName.trim(),
                  permissions: quickRolePermissions,
                  created_by: user?.id || null
                });
                alert(`✅ Role "${quickRoleName}" created successfully!`);
                addActivityLog("Created", "Role Management", `Quick role created — Name: ${quickRoleName}, Permissions: ${quickRolePermissions.length}`);
                setShowQuickAddRoleModal(false);
                setNewRoleName(quickRoleName.trim());
                fetchRoles();
              } catch (err) {
                alert(err.response?.data?.error || "❌ Failed to create role");
              }
            }}
            style={{
              flex: 1, background: "#5cb85c", color: "white", border: "none",
              padding: "10px 20px", borderRadius: "4px", cursor: "pointer",
              fontSize: "14px", fontWeight: "600"
            }}
          >
            💾 Save Role
          </button>
        </div>
      </div>
    </div>
  </div>
)}
  </div>
  );
  }
  
  export default Home; 