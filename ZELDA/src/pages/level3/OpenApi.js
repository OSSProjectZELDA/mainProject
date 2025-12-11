// 1. 통화 이름 데이터 (names)
// (모든 통화 코드를 다 넣어서 완벽하게 매칭되도록 했습니다)
const names = {
    "USD": "미국 달러", "JPY": "일본 엔", "EUR": "유로",
    "GBP": "영국 파운드", "CAD": "캐나다 달러", "AUD": "호주 달러",
    "CHF": "스위스 프랑", "HKD": "홍콩 달러", "SGD": "싱가포르 달러", 
    "CNH": "역외 위안화", "CNY": "중국 위안", "NZD": "뉴질랜드 달러",
    "THB": "태국 바트", "VND": "베트남 동", "ZAR": "남아공 랜드",
    "AED": "아랍에미리트 디르함", "AFN": "아프가니스탄 아프가니", "ALL": "알바니아 레크",
    "AMD": "아르메니아 드람", "ANG": "네덜란드령 안틸레스 길더", "AOA": "앙골라 콴자",
    "ARS": "아르헨티나 페소", "AWG": "아루바 플로린", "AZN": "아제르바이잔 마나트",
    "BAM": "보스니아 헤르체고비나 마르카", "BBD": "바베이도스 달러", "BDT": "방글라데시 타카",
    "BGN": "불가리아 레프", "BHD": "바레인 디나르", "BIF": "부룬디 프랑",
    "BMD": "버뮤다 달러", "BND": "브루나이 달러", "BOB": "볼리비아노",
    "BRL": "브라질 헤알", "BSD": "바하마 달러", "BTN": "부탄 눌트럼",
    "BWP": "보츠와나 풀라", "BYN": "벨라루스 루블", "BZD": "벨리즈 달러",
    "CDF": "콩고 프랑", "CLF": "칠레 유닛포멘토", "CLP": "칠레 페소",
    "COP": "콜롬비아 페소", "CRC": "코스타리카 콜론", "CUP": "쿠바 페소",
    "CVE": "카보베르데 에스쿠도", "CZK": "체코 코루나", "DJF": "지부티 프랑",
    "DKK": "덴마크 크로네", "DOP": "도미니카 페소", "DZD": "알제리 디나르",
    "EGP": "이집트 파운드", "ERN": "에리트레아 나크파", "ETB": "에티오피아 비르",
    "FJD": "피지 달러", "FKP": "포클랜드 파운드", "FOK": "파로 제도 크로네",
    "GEL": "조지아 라리", "GGP": "건지 파운드", "GHS": "가나 세디",
    "GIP": "지브롤터 파운드", "GMD": "감비아 달라시", "GNF": "기니 프랑",
    "GTQ": "과테말라 케찰", "GYD": "가이아나 달러", "HNL": "온두라스 렘피라",
    "HRK": "크로아티아 쿠나", "HTG": "아이티 구르드", "HUF": "헝가리 포린트",
    "IDR": "인도네시아 루피아", "ILS": "이스라엘 셰켈", "IMP": "맨 섬 파운드",
    "INR": "인도 루피", "IQD": "이라크 디나르", "IRR": "이란 리알",
    "ISK": "아이슬란드 크로나", "JEP": "저지 파운드", "JMD": "자메이카 달러",
    "JOD": "요르단 디나르", "KES": "케냐 실링", "KGS": "키르기스스탄 솜",
    "KHR": "캄보디아 리엘", "KID": "키리바시 달러", "KMF": "코모로 프랑",
    "KWD": "쿠웨이트 디나르", "KYD": "케이맨 제도 달러", "KZT": "카자흐스탄 텡게",
    "LAK": "라오스 킵", "LBP": "레바논 파운드", "LKR": "스리랑카 루피",
    "LRD": "라이베리아 달러", "LSL": "레소토 로티", "LYD": "리비아 디나르",
    "MAD": "모로코 디르함", "MDL": "몰도바 레이", "MGA": "마다가스카르 아리아리",
    "MKD": "마케도니아 데나르", "MMK": "미얀마 짯", "MNT": "몽골 투그릭",
    "MOP": "마카오 파타카", "MRU": "모리타니 우기야", "MUR": "모리셔스 루피",
    "MVR": "몰디브 루피야", "MWK": "말라위 콰차", "MXN": "멕시코 페소",
    "MYR": "말레이시아 링깃", "MZN": "모잠비크 메티칼", "NAD": "나미비아 달러",
    "NGN": "나이지리아 나이라", "NIO": "니카라과 코르도바", "NOK": "노르웨이 크로네",
    "NPR": "네팔 루피", "OMR": "오만 리알", "PAB": "파나마 발보아",
    "PEN": "페루 솔", "PGK": "파푸아뉴기니 키나", "PHP": "필리핀 페소",
    "PKR": "파키스탄 루피", "PLN": "폴란드 즐로티", "PYG": "파라과이 과라니",
    "QAR": "카타르 리얄", "RON": "루마니아 레우", "RSD": "세르비아 디나르",
    "RUB": "러시아 루블", "RWF": "르완다 프랑", "SAR": "사우디 리얄",
    "SBD": "솔로몬 제도 달러", "SCR": "세이셸 루피", "SDG": "수단 파운드",
    "SEK": "스웨덴 크로나", "SHP": "세인트헬레나 파운드", "SLE": "시에라리온 레온",
    "SLL": "시에라리온 레온 (구)", "SOS": "소말리아 실링", "SRD": "수리남 달러",
    "SSP": "남수단 파운드", "STN": "상투메 프린시페 도브라", "SYP": "시리아 파운드",
    "SZL": "에스와티니 릴랑게니", "TRY": "튀르키예 리라", "TTD": "트리니다드 토바고 달러",
    "TVD": "투발루 달러", "TWD": "대만 달러", "TZS": "탄자니아 실링",
    "UAH": "우크라이나 그리브나", "UGX": "우간다 실링", "UYU": "우루과이 페소",
    "UZS": "우즈베키스탄 숨", "VES": "베네수엘라 볼리바르", "VUV": "바누아투 바투",
    "WST": "사모아 탈라", "XAF": "CFA 프랑 (BEAC)", "XCD": "동카리브 달러",
    "XDR": "특별인출권", "XOF": "CFA 프랑 (BCEAO)", "XPF": "CFP 프랑",
    "YER": "예멘 리얄", "ZMW": "잠비아 콰차", "ZWG": "짐바브웨 달러 (구)",
    "ZWL": "짐바브웨 달러"
};

const KEY = '802652e2dc2de4a8408dc9d7';
const URL = `https://v6.exchangerate-api.com/v6/${KEY}/latest/USD`;

// 2. 환율 가져오기 (이름 짧고 쉽게: getRates)
export const getRates = async () => {
    try {
        const res = await fetch(URL);
        if (!res.ok) throw new Error("API Error");

        const json = await res.json();
        const list = json.conversion_rates; 
        const krw = list['KRW']; // 1달러 = 1400원

        // 데이터 가공 (복잡한 로직 제거하고 핵심만)
        const result = Object.keys(list).map(code => {
            // 계산: (1달러당 원화) / (1달러당 해당통화)
            const val = krw / list[code]; 

            return {
                code: code,                  // 통화 코드 (USD)
                name: names[code] || code,   // 한글 이름
                rate: val.toLocaleString(undefined, { // 콤마 찍기
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            };
        });

        // 한국돈(KRW)이랑 베트남(VND) 빼고 반환
        return result.filter(item => item.code !== 'KRW' && item.code !== 'VND');

    } catch (err) {
        console.error("API 에러:", err);
        return [];
    }
};

// 3. 검색 함수 (이름 짧고 쉽게: find)
export const find = (list, text) => {
    if (!text) return list; // 검색어 없으면 전체 반환

    const key = text.toUpperCase(); // 대문자로 변환 (aud -> AUD)
    
    // 이름이나 코드에 검색어가 포함되면 OK
    return list.filter(item => item.name.includes(key) || item.code.includes(key));
};