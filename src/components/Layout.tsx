import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from 'motion/react'
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { CaseDetails } from "./CaseDetails";
import { CreateCaseModal } from "./CreateCaseModal";
import { PDFViewerModal } from "./PDFViewerModal";
import { useAuthStore } from "../store/AuthStore";
import { useMsal } from "@azure/msal-react";
import { useApi } from "../hooks/UseApi";
import { CasesDashboard } from "./cases/CaseDashboard";


export default function Layout() {
  const logout = useAuthStore((state) => state.logout);
  const { instance } = useMsal();
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    useAuthStore.persist.clearStorage();
    logout();
    await instance.logoutPopup();
  };

  const [currentView, setCurrentView] = useState<
    "dashboard" | "case-details"
  >("dashboard");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // --- API hooks ---
  const {
    data: caseList,
    loading: loadingCases,
    fetchData: fetchCases,
  } = useApi<{ items: Case[]; total: number }>("cases");

  const {
    postData: createCaseApi,
    loading: creatingCase,
  } = useApi<Case>("cases");

  // --- Local state ---
  const [cases, setCases] = useState<Case[]>([]);

  // Fetch cases on mount
  useEffect(() => {
    const loadCases = async () => {
      const result = await fetchCases();
      if (result?.items) {
        setCases(result.items);
      }
    };
    if (currentView === "dashboard") {
      loadCases();
    }
  }, [currentView]);

  const handleOpenCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setCurrentView("case-details");
  };

  const handleNewCase = () => {
    setIsCreateCaseOpen(true);
  };

  const handleCaseCreated = async (caseData: Partial<Case>) => {
    const created = await createCaseApi(caseData);
    if (created) {
      setCases((prev) => [created, ...prev]);
      setIsCreateCaseOpen(false);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCase(null);
  };

  const handleViewDocument = (documentId: string, documentName: string) => {
    setSelectedDocument({ id: documentId, name: documentName });
    setIsPDFViewerOpen(true);
  };

  const handleClosePDFViewer = () => {
    setIsPDFViewerOpen(false);
    setSelectedDocument(null);
  };

  const handleCaseUpdated = (updatedCase: Case) => {
    setCases((prev) =>
      prev.map((c) => (c.case_id === updatedCase.case_id ? updatedCase : c))
    );
    setSelectedCase(updatedCase);
  };

  return (
    <div className="min-h-screen bg-background flex">

      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary-solid/20 to-secondary-solid/20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-accent-solid/20 to-primary-solid/20 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        onNavigateToDashboard={handleBackToDashboard}
        currentView={currentView}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        <main className="flex-1 overflow-auto">
          {currentView === "dashboard" ? (
            <CasesDashboard
              cases={cases}
              loading={loadingCases}
              onOpenCase={handleOpenCase}
              onNewCase={handleNewCase}
            />
          ) : (
            selectedCase && (
              <CaseDetails
                case={selectedCase}
                onBack={handleBackToDashboard}
                onViewDocument={handleViewDocument}
                onCaseUpdated={handleCaseUpdated}
              />
            )
          )}
        </main>
      </div>

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={isCreateCaseOpen}
        onClose={() => setIsCreateCaseOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      {/* PDF Viewer Modal */}
      {selectedDocument && (
        <PDFViewerModal
          isOpen={isPDFViewerOpen}
          onClose={handleClosePDFViewer}
          billId={selectedDocument.id}
          billName={selectedDocument.name}
        />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
