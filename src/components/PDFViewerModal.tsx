import { X, Download, Printer, ZoomIn, ZoomOut, RotateCw, Menu } from 'lucide-react'
import { Modal } from './modern/Modal'
import { Button } from './modern/Button'
import { motion } from 'motion/react'

interface PDFViewerModalProps {
  isOpen: boolean
  onClose: () => void
  billId: string
  billName: string
}

export function PDFViewerModal({ isOpen, onClose, billId, billName }: PDFViewerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <h2 className="font-semibold">{billId}: {billName}</h2>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden">
          {/* PDF Toolbar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2 shadow-lg"
            >
              <div className="text-white text-sm px-2">
                2025-HB2001.pdf
              </div>
              <div className="w-px h-6 bg-gray-600" />
              <div className="flex items-center text-white text-sm">
                <span>1</span>
                <span className="mx-1">/</span>
                <span>1</span>
              </div>
              <div className="w-px h-6 bg-gray-600" />
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 h-8 w-8 p-0">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-white text-sm px-2">100%</span>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 h-8 w-8 p-0">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-px h-6 bg-gray-600" />
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 h-8 w-8 p-0">
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 h-8 w-8 p-0">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* PDF Content */}
          <div className="flex items-center justify-center h-full p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-xl rounded-lg max-w-4xl w-full max-h-full overflow-auto"
            >
              {/* PDF Page */}
              <div className="p-12 min-h-[800px]">
                <div className="space-y-8">
                  {/* Bill Header */}
                  <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      HOUSE BILL NO. 4798
                    </h1>
                  </div>

                  {/* Bill Details */}
                  <div className="space-y-6 text-gray-800">
                    <p className="text-center">
                      August 28, 2025. Introduced by Rep. Healthcare and referred to Committee on National Resources and Tourism.
                    </p>

                    <div className="space-y-4">
                      <p>
                        <strong>A BILL</strong> to amend 1974 PA 451, as amended, sections 1928-1950 (MCL 333.1928-333.1950),
                        "Patient resources and environmental protection act" created by section
                        52 enacting new sections 204a of Title 28 USC Act 2018 to 207,
                        by amending section 1 of 333 or pertaining to preventive
                        and secondary oversight.
                      </p>

                      <div className="space-y-2">
                        <p><strong>1</strong> Sec. 1841. As used in this part:</p>
                        <p><strong>2</strong> (a) "Access" means the Michigan address resources trust fund</p>
                        <p><strong>3</strong> board established under the Michigan natural resources trust fund.</p>
                        <p><strong>4</strong> Sec. 1842.</p>
                        <p><strong>5</strong> (a) "Grant unit of government or public authority" means a</p>
                        <p><strong>6</strong> local unit of government, college, school district, intermediate</p>
                        <p><strong>7</strong> school</p>
                        <p><strong>8</strong> authority, or intermediate school district authority or entity</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                      <span>This</span>
                      <span>SEN1ECLS: 7 DETROIT 2025.</span>
                      <span>page 1</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Modal>
  )
}