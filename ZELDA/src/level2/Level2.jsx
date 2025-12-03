import { useEffect, useState } from "react";

// --- 유틸리티 ---
function bytesToArray(b) { return Array.from(b); }
function arrToU8(a) { return new Uint8Array(a); }

const STORAGE = {
  notes: "safememo_data_v1",
  jwkBackup: "safememo_sess_key",
};
const SECRET_FLAG = "FLAG{Real_World_Hacking_Is_Silent}";

export default function Level2() {
  // --- State ---
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [plainContent, setPlainContent] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(false);
  
  // UI State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [sysError, setSysError] = useState("");

  // 1. 초기화 및 자가 진단
  useEffect(() => {
    (async () => {
      const savedKey = sessionStorage.getItem(STORAGE.jwkBackup);
      const savedNotes = localStorage.getItem(STORAGE.notes);

      if (!savedKey || !savedNotes) {
        const k = await crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
        );
        const jwk = await crypto.subtle.exportKey("jwk", k);
        
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv }, k, new TextEncoder().encode(SECRET_FLAG)
        );

        const initial = [{
          id: 1,
          title: "🔒 [기밀] 프로젝트 알파 접근 코드",
          date: new Date().toLocaleDateString(),
          isEncrypted: true,
          iv: bytesToArray(iv),
          data: bytesToArray(new Uint8Array(ct)),
          content: "",
          sender: "Administrator"
        }];
        
        sessionStorage.setItem(STORAGE.jwkBackup, JSON.stringify(jwk));
        localStorage.setItem(STORAGE.notes, JSON.stringify(initial));
        setNotes(initial);
      } else {
        setNotes(JSON.parse(savedNotes));
      }
    })();
  }, []);

  // --- 핸들러 ---

  const handleSelectNote = (n) => {
    setSelected(n);
    setPlainContent("");
    setIsDecrypted(false);
    setSysError("");
    setShowRecovery(false);

    if (!n.isEncrypted) {
      setPlainContent(n.content);
      setIsDecrypted(true);
    } else {
      setSysError("⚠️ 복호화 실패: 세션 키를 찾을 수 없습니다.");
    }
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNote = {
      id: Date.now(),
      title: newTitle, // XSS Sink
      date: new Date().toLocaleDateString(),
      isEncrypted: false,
      content: "사용자 작성 메모",
      sender: "Me"
    };

    const updated = [newNote, ...notes];
    localStorage.setItem(STORAGE.notes, JSON.stringify(updated));
    setNotes(updated);
    setNewTitle("");
    setIsComposeOpen(false);
  };

  const handleDeleteNote = (e, noteId) => {
    e.stopPropagation();
    if(!confirm("삭제하시겠습니까?")) return;
    const updated = notes.filter(n => n.id !== noteId);
    setNotes(updated);
    localStorage.setItem(STORAGE.notes, JSON.stringify(updated));
    if (selected?.id === noteId) setSelected(null);
  };

  // 🔑 [수정됨] 핵심 키 값(k)만 받아서 복구하는 로직
  const handleManualDecrypt = async (e) => {
    e.preventDefault();
    try {
      // 사용자가 입력한 값 (예: yclNsO52PLScyc...)
      const rawKeyString = recoveryKey.trim();

      // 입력값이 비어있거나 너무 짧으면 에러
      if (!rawKeyString || rawKeyString.length < 10) {
        throw new Error("키 값이 유효하지 않습니다.");
      }

      // 1. 입력받은 문자열을 다시 유효한 JWK 객체로 포장
      const jwkObject = {
        kty: "oct",
        k: rawKeyString, // 여기가 핵심! 사용자의 입력값
        alg: "A256GCM",
        ext: true,
        key_ops: ["encrypt", "decrypt"]
      };

      // 2. Web Crypto API로 키 변환
      const imported = await crypto.subtle.importKey(
        "jwk", 
        jwkObject, 
        { name: "AES-GCM" }, 
        true, 
        ["decrypt"]
      );

      // 3. 복호화 시도
      const buf = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: arrToU8(selected.iv) }, 
        imported, 
        arrToU8(selected.data)
      );

      setPlainContent(new TextDecoder().decode(buf));
      setIsDecrypted(true);
      setSysError("");
      setShowRecovery(false);

    } catch (err) {
      console.error(err);
      alert("복구 실패: 올바른 키 값이 아닙니다. (JSON이 아닌 'k' 값만 입력하세요)");
    }
  };

  const handleReset = () => {
    if(!confirm("초기화 하시겠습니까?")) return;
    localStorage.removeItem(STORAGE.notes);
    sessionStorage.removeItem(STORAGE.jwkBackup);
    location.reload();
  };

  const handleLogout = () => {
    if(!confirm("로그아웃 하시겠습니까?")) return;
    handleReset();
  };

  // --- 렌더링 ---
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", background: "#f5f7fa", color: "#333" }}>
      
      {/* 1. 사이드바 */}
      <div style={{ width: 280, background: "white", borderRight: "1px solid #e1e4e8", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 24, height: 24, background: "#2563eb", borderRadius: "4px" }}></div>
          <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "#1e293b" }}>SafeMemo</span>
        </div>

        <div style={{ padding: "20px" }}>
          <button 
            onClick={() => setIsComposeOpen(true)}
            style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", boxShadow: "0 2px 4px rgba(37,99,235,0.2)" }}
          >
            + 새 메모 작성
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ padding: "0 20px 10px", fontSize: "0.8rem", color: "#94a3b8", fontWeight: "bold" }}>보관함</div>
          {notes.map(n => (
            <div 
              key={n.id} 
              onClick={() => handleSelectNote(n)}
              style={{
                padding: "15px 20px", borderBottom: "1px solid #f1f5f9", cursor: "pointer",
                background: selected?.id === n.id ? "#eff6ff" : "white",
                borderLeft: selected?.id === n.id ? "4px solid #2563eb" : "4px solid transparent",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{n.sender}</span>
                <button 
                  onClick={(e) => handleDeleteNote(e, n.id)}
                  style={{ background: "none", border: "none", color: "#ef4444", fontSize: "1.1rem", cursor: "pointer", padding: "0 5px", lineHeight: "1" }}
                  title="삭제"
                >
                  ×
                </button>
              </div>
              {/* 목록: 텍스트로만 표시 (안전) */}
              <div 
                style={{ 
                  fontWeight: "600", color: "#334155", fontSize: "0.95rem", 
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "10px" 
                }}
              >
                {n.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#cbd5e1", marginTop: "4px" }}>{n.date}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: "15px", borderTop: "1px solid #e1e4e8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>U</div>
            <div style={{ fontSize: "0.9rem", fontWeight: "500" }}>User</div>
          </div>
          <div style={{ display: 'flex', gap: '10px'}}>
            <button onClick={handleReset} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem" }}>초기화</button>
            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.8rem" }}>로그아웃</button>
          </div>
        </div>
      </div>

      {/* 2. 메인 컨텐츠 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selected ? (
          <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
            <div style={{ marginBottom: "30px" }}>
              {/* 제목: XSS 실행 지점 */}
              <h1 
                style={{ fontSize: "1.8rem", color: "#0f172a", marginBottom: "10px" }} 
                dangerouslySetInnerHTML={{ __html: selected.title }} 
              />
              <div style={{ display: "flex", gap: "15px", fontSize: "0.9rem", color: "#64748b" }}>
                <span>보낸 사람: <strong>{selected.sender}</strong></span>
                <span>•</span>
                <span>{selected.date}</span>
                {selected.isEncrypted && <span style={{ color: isDecrypted ? "#10b981" : "#ef4444", fontWeight: "bold" }}>• {isDecrypted ? "잠금 해제됨" : "E2E 암호화"}</span>}
              </div>
            </div>

            <hr style={{ border: "none", borderBottom: "1px solid #e2e8f0", marginBottom: "30px" }} />

            <div style={{ lineHeight: "1.6", color: "#334155", fontSize: "1.05rem" }}>
              {isDecrypted ? (
                <div style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{plainContent}</div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "60px 20px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "20px", opacity: 0.5 }}>🔒</div>
                  <h3 style={{ color: "#475569", marginBottom: "10px" }}>이 메모는 암호화되어 있습니다</h3>
                  
                  {sysError && (
                    <div style={{ color: "#dc2626", background: "#fef2f2", padding: "10px", borderRadius: "6px", display: "inline-block", fontSize: "0.9rem", marginBottom: "20px" }}>
                      {sysError}
                    </div>
                  )}

                  {!showRecovery ? (
                    <div>
                      <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "20px" }}>
                        시스템 오류로 세션 키가 손실되었습니다.<br/>
                        백업된 키가 있다면 수동으로 복구하십시오.
                      </p>
                      <button 
                        onClick={() => setShowRecovery(true)}
                        style={{ padding: "8px 16px", background: "white", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", color: "#475569", fontSize: "0.9rem" }}
                      >
                        키 수동 복구
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleManualDecrypt} style={{ maxWidth: "400px", margin: "0 auto" }}>
                      <label style={{display: 'block', textAlign:'left', marginBottom:'5px', fontSize:'0.85rem', color:'#64748b'}}>
                        백업 키 (k 값) 입력:
                      </label>
                      <input 
                        type="text"
                        value={recoveryKey}
                        onChange={e => setRecoveryKey(e.target.value)}
                        placeholder="예: yclNsO52PLScyceOJWaBW..."
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #cbd5e1", marginBottom: "10px", fontFamily: "monospace", boxSizing:"border-box" }}
                      />
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button type="button" onClick={() => setShowRecovery(false)} style={{ padding: "8px 16px", background: "white", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>취소</button>
                        <button type="submit" style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>복호화</button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            메모를 선택하여 내용을 확인하세요
          </div>
        )}
      </div>

      {/* 3. 새 메모 작성 모달 */}
      {isComposeOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", width: "400px", padding: "20px", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#1e293b" }}>새 메모 작성</h3>
            <form onSubmit={handleSaveNote}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#64748b", marginBottom: "5px" }}>제목</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "4px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" onClick={() => setIsComposeOpen(false)} style={{ padding: "8px 16px", background: "white", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>취소</button>
                <button type="submit" style={{ padding: "8px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}