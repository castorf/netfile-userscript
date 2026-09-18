import { useState, useEffect, useRef } from 'preact/hooks';
import { Contribution, EnteredStatusMap, NetFileScreen, PayoutBatch } from './types';
import { MOCK_CONTRIBUTIONS } from './mockData';
import { convertActBlueCSV, computePayoutBatches } from './parser';
import { detectCurrentScreen } from './netfile/screenDetector';
import {
  searchEntity,
  navigateToCreateIndividual,
  fillPeopleAddForm,
  fillOrganizationAddForm,
  fillTransactionAddForm,
  fillDisbursementForm
} from './netfile/actions';

const STORAGE_DATA_KEY = 'actblue_user_data_v1';
const STORAGE_STATUS_KEY = 'actblue_entered_status_v1';
const STORAGE_INDEX_KEY = 'actblue_current_index_v1';

export function App() {
  const [contributions, setContributions] = useState<Contribution[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DATA_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [statusMap, setStatusMap] = useState<EnteredStatusMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STATUS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INDEX_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [screen, setScreen] = useState<NetFileScreen>('Unknown');
  const [activeTab, setActiveTab] = useState<'transactions' | 'batches'>('transactions');
  const [isMinimized, setIsMinimized] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Detect NetFile screen on mount and periodically (for SPAs)
  useEffect(() => {
    const updateScreen = () => setScreen(detectCurrentScreen());
    updateScreen();
    const interval = setInterval(updateScreen, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save index on change
  useEffect(() => {
    localStorage.setItem(STORAGE_INDEX_KEY, currentIndex.toString());
  }, [currentIndex]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  const copyToClipboard = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt).then(() => {
      showToast(`Copied ${label}!`);
    });
  };

  const handleFileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = convertActBlueCSV(text);
      if (parsed.length === 0) {
        alert('Could not parse any contributions from this CSV. Check format.');
        return;
      }
      setContributions(parsed);
      setCurrentIndex(0);
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(parsed));
      showToast(`Loaded ${parsed.length} contributions!`);
    };
    reader.readAsText(file);
  };

  const handleLoadMock = () => {
    setContributions(MOCK_CONTRIBUTIONS);
    setCurrentIndex(0);
    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(MOCK_CONTRIBUTIONS));
    showToast(`Loaded ${MOCK_CONTRIBUTIONS.length} test records!`);
  };

  const handleClear = () => {
    if (confirm('Clear uploaded contributions from browser storage?')) {
      setContributions([]);
      setStatusMap({});
      setCurrentIndex(0);
      localStorage.removeItem(STORAGE_DATA_KEY);
      localStorage.removeItem(STORAGE_STATUS_KEY);
      localStorage.removeItem(STORAGE_INDEX_KEY);
      showToast('Data cleared.');
    }
  };

  const handleToggleEntered = () => {
    const c = contributions[currentIndex];
    if (!c) return;
    const next = !statusMap[c.id];
    const updated = { ...statusMap, [c.id]: next };
    setStatusMap(updated);
    localStorage.setItem(STORAGE_STATUS_KEY, JSON.stringify(updated));
    showToast(next ? 'Marked Entered ✓' : 'Marked Pending');
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < contributions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // Dragging logic
  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT') return;
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    panel.style.bottom = 'auto';
    panel.style.right = 'auto';
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = rect.left;
    const initialTop = rect.top;

    const onMouseMove = (moveEvent: MouseEvent) => {
      panel.style.left = `${initialLeft + (moveEvent.clientX - startX)}px`;
      panel.style.top = `${initialTop + (moveEvent.clientY - startY)}px`;
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const current = contributions[currentIndex];
  const isEntered = current ? !!statusMap[current.id] : false;
  const payoutBatches: PayoutBatch[] = computePayoutBatches(contributions);

  // Overall fee totals
  const totalGross = contributions.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);
  const totalStripe = contributions.reduce((acc, c) => acc + (parseFloat(c.stripeFee) || 0), 0);
  const totalActBlue = contributions.reduce((acc, c) => acc + (parseFloat(c.actblueFee) || 0), 0);
  const totalCombinedFees = totalStripe + totalActBlue;

  return (
    <div id="actblue-userscript-panel" ref={panelRef}>
      {/* Header */}
      <div className="ab-header" onMouseDown={handleMouseDown}>
        <div className="ab-title">
          <span>NetFile Assistant</span>
          {contributions.length > 0 && activeTab === 'transactions' && (
            <span className="ab-counter">
              {currentIndex + 1} / {contributions.length}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {current && activeTab === 'transactions' && (
            <span className={`ab-badge ${isEntered ? 'ab-badge-entered' : 'ab-badge-pending'}`}>
              {isEntered ? 'Entered' : 'Pending'}
            </span>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '14px' }}
          >
            {isMinimized ? '+' : '−'}
          </button>
        </div>
      </div>

      {toast && <div className="ab-toast">{toast}</div>}

      {!isMinimized && (
        <>
          <div className="ab-body">
            {/* Upload View if no data */}
            {contributions.length === 0 ? (
              <div>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <div className="ab-upload-box" onClick={() => fileInputRef.current?.click()}>
                  <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: 4 }}>
                    📁 Click to Upload ActBlue CSV
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    Data stays 100% inside your browser session
                  </div>
                </div>
                <button
                  className="ab-btn ab-btn-secondary"
                  style={{ width: '100%' }}
                  onClick={handleLoadMock}
                >
                  🧪 Load Synthetic Test Data
                </button>
              </div>
            ) : (
              <>
                {/* Active Screen Action Helper */}
                <div className="ab-screen-banner">
                  <div className="ab-screen-tag">
                    {screen === 'SelectEntity' && 'Step 1: Entity Search'}
                    {screen === 'PeopleAdd' && 'Step 2: Add New Individual'}
                    {screen === 'OrgAdd' && 'Modal: Add Organization'}
                    {screen === 'TransactionAddContribution' && 'Step 3: Monetary Contribution'}
                    {screen === 'TransactionAddDisbursement' && 'Enter Expense / Fee'}
                    {screen === 'Unknown' && 'Current Screen'}
                  </div>

                  {screen === 'SelectEntity' && current && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="ab-btn ab-btn-action"
                        onClick={() => {
                          searchEntity(current.lastName || current.fullName);
                          showToast(`Searching for "${current.lastName || current.fullName}"...`);
                        }}
                      >
                        🔍 Search "{current.lastName}"
                      </button>
                      <button
                        className="ab-btn ab-btn-secondary"
                        onClick={() => navigateToCreateIndividual()}
                        title="If not found, click to create new individual"
                      >
                        ➕ New Person
                      </button>
                    </div>
                  )}

                  {screen === 'PeopleAdd' && current && (
                    <button
                      className="ab-btn ab-btn-action"
                      onClick={() => {
                        const count = fillPeopleAddForm(current);
                        showToast(`Filled ${count} contributor fields!`);
                      }}
                    >
                      ⚡ Fill Contributor Info
                    </button>
                  )}

                  {screen === 'OrgAdd' && current && (
                    <button
                      className="ab-btn ab-btn-action"
                      onClick={() => {
                        const count = fillOrganizationAddForm(current);
                        showToast(`Filled ${count} organization fields in modal!`);
                      }}
                    >
                      ⚡ Fill Organization Info
                    </button>
                  )}

                  {screen === 'TransactionAddContribution' && current && (
                    <button
                      className="ab-btn ab-btn-action"
                      onClick={() => {
                        const count = fillTransactionAddForm(current);
                        showToast(`Filled Date (${current.dateUS}) & Amount ($${current.amount})!`);
                      }}
                    >
                      ⚡ Fill Contribution (${current.amount})
                    </button>
                  )}

                  {screen === 'TransactionAddDisbursement' && current && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <button
                        className="ab-btn ab-btn-action"
                        onClick={() => {
                          fillDisbursementForm({
                            date: current.dateUS,
                            amount: current.totalFee,
                            description: `ActBlue/Stripe processing fee (${current.fullName})`
                          });
                          showToast(`Filled Total Fee: $${current.totalFee}!`);
                        }}
                      >
                        ⚡ Fill Total Fee (${current.totalFee})
                      </button>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="ab-btn ab-btn-secondary"
                          style={{ flex: 1, fontSize: 11 }}
                          onClick={() => {
                            fillDisbursementForm({
                              date: current.dateUS,
                              amount: current.stripeFee,
                              description: `Stripe fee (${current.fullName})`
                            });
                            showToast(`Filled Stripe Fee: $${current.stripeFee}!`);
                          }}
                        >
                          Stripe Fee (${current.stripeFee})
                        </button>
                        <button
                          className="ab-btn ab-btn-secondary"
                          style={{ flex: 1, fontSize: 11 }}
                          onClick={() => {
                            fillDisbursementForm({
                              date: current.dateUS,
                              amount: current.actblueFee,
                              description: `ActBlue fee (${current.fullName})`
                            });
                            showToast(`Filled ActBlue Fee: $${current.actblueFee}!`);
                          }}
                        >
                          ActBlue Fee (${current.actblueFee})
                        </button>
                      </div>
                    </div>
                  )}

                  {screen === 'Unknown' && (
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                      Navigate to <em>Transactions &gt; Money In</em> or <em>Disbursements</em>
                    </div>
                  )}
                </div>

                {/* Tab Navigation */}
                <div className="ab-tabs">
                  <button
                    className={`ab-tab ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                  >
                    Transactions ({contributions.length})
                  </button>
                  <button
                    className={`ab-tab ${activeTab === 'batches' ? 'active' : ''}`}
                    onClick={() => setActiveTab('batches')}
                  >
                    Payout Fee Batches ({payoutBatches.length})
                  </button>
                </div>

                {activeTab === 'transactions' ? (
                  <>
                    {/* Donor Dropdown */}
                    <select
                      className="ab-select"
                      value={currentIndex}
                      onChange={(e) => setCurrentIndex(parseInt((e.target as HTMLSelectElement).value, 10))}
                    >
                      {contributions.map((c, i) => (
                        <option key={c.id} value={i}>
                          {statusMap[c.id] ? '✓ ' : '• '} #{i + 1} {c.fullName} (${c.amount}) — Fee: ${c.totalFee}
                        </option>
                      ))}
                    </select>

                    {/* Donor Fields (with 1-click copy) */}
                    {current && (
                      <>
                        <div className="ab-row">
                          <span className="ab-label">Donor</span>
                          <span
                            className="ab-val ab-copyable"
                            onClick={() => copyToClipboard(current.fullName, 'Name')}
                            title="Click to copy"
                          >
                            {current.fullName}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">Gross</span>
                          <span
                            className="ab-val ab-amount ab-copyable"
                            onClick={() => copyToClipboard(current.amount, 'Gross Amount')}
                            title="Click to copy"
                          >
                            ${current.amount}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">Stripe Fee</span>
                          <span
                            className="ab-val ab-fee ab-copyable"
                            onClick={() => copyToClipboard(current.stripeFee, 'Stripe Fee')}
                            title="Click to copy"
                          >
                            ${current.stripeFee}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">ActBlue Fee</span>
                          <span
                            className="ab-val ab-fee ab-copyable"
                            onClick={() => copyToClipboard(current.actblueFee, 'ActBlue Fee')}
                            title="Click to copy"
                          >
                            ${current.actblueFee}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">Total Fee</span>
                          <span
                            className="ab-val ab-fee ab-copyable"
                            style={{ fontWeight: 700 }}
                            onClick={() => copyToClipboard(current.totalFee, 'Total Fee')}
                            title="Click to copy"
                          >
                            ${current.totalFee}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">Net Deposit</span>
                          <span
                            className="ab-val ab-copyable"
                            style={{ color: '#60a5fa' }}
                            onClick={() => copyToClipboard(current.netSettlement, 'Net Deposit')}
                            title="Click to copy"
                          >
                            ${current.netSettlement}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">Date</span>
                          <span
                            className="ab-val ab-copyable"
                            onClick={() => copyToClipboard(current.dateUS, 'Date')}
                            title="Click to copy"
                          >
                            {current.dateUS}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">Payout Date</span>
                          <span
                            className="ab-val ab-copyable"
                            onClick={() => copyToClipboard(current.payoutDate, 'Payout Date')}
                            title="Click to copy"
                          >
                            {current.payoutDate || 'Pending'}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">Address</span>
                          <span
                            className="ab-val ab-copyable"
                            onClick={() => copyToClipboard(`${current.address}, ${current.city}, ${current.state} ${current.zip}`, 'Address')}
                            title="Click to copy"
                          >
                            {current.address}, {current.city}, {current.state} {current.zip}
                          </span>
                        </div>
                        <div className="ab-row">
                          <span className="ab-label">Work</span>
                          <span
                            className="ab-val ab-copyable"
                            onClick={() => copyToClipboard(`${current.occupation} / ${current.employer}`, 'Occupation/Employer')}
                            title="Click to copy"
                          >
                            {current.occupation} / {current.employer}
                          </span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  /* Batches View */
                  <div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>
                      Summary of fees grouped by bank payout settlement:
                    </div>
                    <table className="ab-batch-table">
                      <thead>
                        <tr>
                          <th>Payout</th>
                          <th>Txns</th>
                          <th>Stripe</th>
                          <th>ActBlue</th>
                          <th>Total Fee</th>
                          {screen === 'TransactionAddDisbursement' && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {payoutBatches.map(b => (
                          <tr key={b.payoutDate}>
                            <td>{b.payoutDate}</td>
                            <td>{b.count}</td>
                            <td className="ab-fee">${b.stripeFee}</td>
                            <td className="ab-fee">${b.actblueFee}</td>
                            <td className="ab-fee" style={{ fontWeight: 700 }}>${b.totalFee}</td>
                            {screen === 'TransactionAddDisbursement' && (
                              <td>
                                <button
                                  className="ab-batch-btn"
                                  onClick={() => {
                                    fillDisbursementForm({
                                      date: b.payoutDate,
                                      amount: b.totalFee,
                                      description: `ActBlue/Stripe fees for payout batch (${b.count} txns)`
                                    });
                                    showToast(`Filled batch fee: $${b.totalFee}!`);
                                  }}
                                >
                                  Fill
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                        <tr style={{ fontWeight: 700, borderTop: '2px solid #374151' }}>
                          <td>TOTAL</td>
                          <td>{contributions.length}</td>
                          <td className="ab-fee">${totalStripe.toFixed(2)}</td>
                          <td className="ab-fee">${totalActBlue.toFixed(2)}</td>
                          <td className="ab-fee">${totalCombinedFees.toFixed(2)}</td>
                          {screen === 'TransactionAddDisbursement' && <td />}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, cursor: 'pointer' }}
                    onClick={handleClear}
                  >
                    Clear Data
                  </button>
                  <button
                    style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: 11, cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Different CSV
                  </button>
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </div>
              </>
            )}
          </div>

          {/* Navigation Bar */}
          {contributions.length > 0 && activeTab === 'transactions' && (
            <div className="ab-nav">
              <button className="ab-btn ab-btn-secondary" onClick={handlePrev} disabled={currentIndex === 0}>
                ◀ Prev
              </button>
              <button
                className={`ab-btn ${isEntered ? 'ab-btn-secondary' : 'ab-btn-success'}`}
                onClick={handleToggleEntered}
              >
                {isEntered ? '✓ Entered' : 'Mark Done'}
              </button>
              <button
                className="ab-btn ab-btn-secondary"
                onClick={handleNext}
                disabled={currentIndex === contributions.length - 1}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
