// api.js

// **API 호출 실패 시 사용될 풍부한 예시 데이터 목록**
const MOCK_DATA = [
    { cur_unit: 'USD', cur_nm: '미국 달러', deal_bas_r: '1,380.00' },
    { cur_unit: 'JPY(100)', cur_nm: '일본 옌', deal_bas_r: '9.30' },
    { cur_unit: 'EUR', cur_nm: '유로', deal_bas_r: '1,490.00' },
    { cur_unit: 'CNH', cur_nm: '위안화', deal_bas_r: '190.00' },
    { cur_unit: 'GBP', cur_nm: '영국 파운드', deal_bas_r: '1,700.50' },
    { cur_unit: 'CAD', cur_nm: '캐나다 달러', deal_bas_r: '1,050.20' },
    { cur_unit: 'AUD', cur_nm: '호주 달러', deal_bas_r: '950.00' },
    { cur_unit: 'CHF', cur_nm: '스위스 프랑', deal_bas_r: '1,550.00' },
    { cur_unit: 'HKD', cur_nm: '홍콩 달러', deal_bas_r: '175.00' },
    { cur_unit: 'SGD', cur_nm: '싱가포르 달러', deal_bas_r: '1,010.80' },
    { cur_unit: 'NZD', cur_nm: '뉴질랜드 달러', deal_bas_r: '880.00' },
    { cur_unit: 'THB', cur_nm: '태국 바트', deal_bas_r: '35.50' },
    { cur_unit: 'VND', cur_nm: '베트남 동', deal_bas_r: '0.05' },
];

const API_KEY = 'bEuMBC96ilXgr5ohrSKVLUWzi4FakoAT'; // 발급된 인증키 반영 (실제 호출 시 필요)

/**
 * 실시간 환율 데이터를 조회합니다.
 * API 호출이 실패하거나 데이터가 없으면 Mock Data를 반환합니다.
 * * @returns {Promise<Array>} 환율 데이터 목록
 */
export const fetchExchangeRateList = async () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${API_KEY}&searchdate=${today}&data=AP01`;

    try {
        const response = await fetch(url);
        
        // HTTP 응답 코드가 200번대가 아니면 에러로 처리
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        
        // 데이터가 비어 있거나, API 오류 코드(result: 4)가 포함된 경우 Mock Data 사용
        if (!Array.isArray(data) || data.length === 0 || (data.length > 0 && data[0].result === 4)) {
            console.warn("API 호출 성공했으나, 데이터가 없거나 오류 코드가 반환됨. Mock Data 사용.");
            return MOCK_DATA;
        }
        
        // List 기능: 성공 시 전체 데이터를 반환
        return data;
        
    } catch (err) {
        // API 호출 자체에서 오류 발생 시 (네트워크, 서버 오류 등)
        console.error("API 호출 실패:", err);
        return MOCK_DATA; // Mock Data 반환
    }
};

/**
 * 주어진 검색어로 환율 데이터를 필터링합니다. (Searching 기능)
 * 이 함수는 클라이언트 측 필터링을 위해 존재합니다.
 * * @param {Array} data - 전체 환율 데이터 목록
 * @param {string} searchTerm - 검색어 (통화명 또는 통화코드)
 * @returns {Array} 필터링된 데이터 목록
 */
export const searchExchangeRate = (data, searchTerm) => {
    if (!searchTerm) return data; // 검색어가 없으면 전체 반환

    const search = searchTerm.toUpperCase();
    return data.filter(item => {
        const matchesSearch = (item.cur_nm && item.cur_nm.toUpperCase().includes(search)) || 
                              (item.cur_unit && item.cur_unit.toUpperCase().includes(search));
        return matchesSearch;
    });
};