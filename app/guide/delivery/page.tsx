import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

export default function DeliveryGuidePage() {
  return (
    <div className="max-w-[clamp(960px,92vw,1440px)] mx-auto px-6 py-12">
      <nav className="text-xs text-charcoal-soft mb-3 flex items-center gap-1">
        <Link href="/guide" className="hover:text-primary">
          가이드 홈
        </Link>
        <span>›</span>
        <Link href="/guide/exchange" className="hover:text-primary">
          환전
        </Link>
        <span>›</span>
        <span className="text-charcoal">외화 배송</span>
      </nav>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📦 환전 비대면 채널 — 외화 배송
        </p>
        <h1 className="text-3xl font-bold mb-2">iM 외화 배송 서비스</h1>
        <p className="text-sm text-charcoal-soft">
          모바일앱뱅킹으로 환전 신청 후 지정 일자·장소로 대면 수령 또는
          CU편의점 수령. 상품설명서·약관 본문 기준.
        </p>
      </header>

      <AdminNote storageKey="fx-guide:note:guide-delivery" />

      {/* iM외화배송 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">📬 iM 외화배송 서비스</h2>
        <p className="text-sm text-charcoal-soft mb-4">
          모바일앱뱅킹으로 환전 신청 후 지정 일자·장소로 외화 배송.
        </p>

        {/* 이용 조건 */}
        <dl className="space-y-2 text-sm mb-4">
          <Row label="가입 대상" value="만 19세 이상 국민인 거주자 개인" />
          <Row
            label="이용 채널"
            value="모바일앱뱅킹 (24시간·연중무휴, 정기점검 시 제외)"
          />
          <Row
            label="필요 계좌"
            value="은행 입출금이 자유로운 예금 계좌 + 전자금융서비스 가입"
          />
          <Row
            label="적용 환율"
            value="환전 신청 시: 현찰매도율 (현찰 살 때) / 재환전 시: 현찰매입율 (현찰 팔 때)"
          />
        </dl>

        {/* 두 가지 방식 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-offwhite">
                <th className="text-left p-2.5 text-xs text-charcoal-soft uppercase tracking-wide w-32">
                  항목
                </th>
                <th className="text-left p-2.5">배달로 받기</th>
                <th className="text-left p-2.5">배달로 보내기 (선물)</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="대상"
                a="이용자 본인"
                b="이용자가 지정한 수령인"
              />
              <CompareRow
                label="수령 방법"
                a="대면수령 / 편의점수령"
                b="대면수령만"
              />
              <CompareRow
                label="1회·1일 한도"
                a="USD 2,000 상당액 이하 (편의점은 원화 100만원 이하)"
                b="원화 100만원 상당액 이하"
              />
              <CompareRow
                label="신청 횟수"
                a="이용자 기준 월 3건 / 연 10건"
                b="이용자·수령인 각 월 3건 / 연 10건"
              />
              <CompareRow
                label="동시 신청"
                a="서비스 완료·취소 전 2건 이상 동시 신청 불가"
                b="동일"
              />
            </tbody>
          </table>
        </div>

        {/* 통화 10종 + 최소금액 */}
        <div className="mt-4">
          <h3 className="text-xs font-medium text-charcoal-soft uppercase tracking-wide mb-2">
            취급 통화 10종 — 건당 최소 금액
          </h3>
          <div className="overflow-x-auto bg-offwhite border border-border rounded-md">
            <table className="w-full text-xs">
              <thead className="text-charcoal-soft">
                <tr className="border-b border-border">
                  <th className="p-2 text-left">USD</th>
                  <th className="p-2 text-left">JPY</th>
                  <th className="p-2 text-left">EUR</th>
                  <th className="p-2 text-left">CNY</th>
                  <th className="p-2 text-left">HKD</th>
                  <th className="p-2 text-left">SGD</th>
                  <th className="p-2 text-left">AUD</th>
                  <th className="p-2 text-left">CAD</th>
                  <th className="p-2 text-left">GBP</th>
                  <th className="p-2 text-left">THB</th>
                </tr>
              </thead>
              <tbody className="text-charcoal font-medium">
                <tr>
                  <td className="p-2">50</td>
                  <td className="p-2">5,000</td>
                  <td className="p-2">50</td>
                  <td className="p-2">300</td>
                  <td className="p-2">300</td>
                  <td className="p-2">50</td>
                  <td className="p-2">50</td>
                  <td className="p-2">50</td>
                  <td className="p-2">50</td>
                  <td className="p-2">1,200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 환율우대 */}
        <div className="mt-4">
          <h3 className="text-xs font-medium text-charcoal-soft uppercase tracking-wide mb-2">
            통화별 환율우대 (현찰매도율 기준)
          </h3>
          <div className="overflow-x-auto bg-white border border-border rounded-md">
            <table className="w-full text-xs">
              <thead className="bg-offwhite text-charcoal-soft">
                <tr className="border-b border-border">
                  <th className="p-2 text-left">통화</th>
                  <th className="p-2 text-left">우대율</th>
                </tr>
              </thead>
              <tbody className="text-charcoal">
                <tr className="border-b border-border">
                  <td className="p-2 font-medium">USD</td>
                  <td className="p-2 text-primary font-bold">90%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-medium">JPY</td>
                  <td className="p-2 text-primary font-bold">80%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-medium">EUR · CNY</td>
                  <td className="p-2 text-primary font-bold">50%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-medium">AUD · CAD · GBP · THB</td>
                  <td className="p-2 text-primary font-bold">20%</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">HKD · SGD</td>
                  <td className="p-2 text-charcoal-soft">우대 없음</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-charcoal-soft mt-1">
            ⚠️ 재환전 시에는 환율우대 미적용.
          </p>
        </div>

        {/* 배송비 + 수령 일정 */}
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="bg-offwhite border border-border rounded-md p-3 text-xs">
            <p className="font-medium text-charcoal mb-1">💸 배송비</p>
            <ul className="text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
              <li>대면 수령: 건당 <strong className="text-charcoal">5,000원</strong></li>
              <li>CU편의점 수령: 건당 <strong className="text-charcoal">3,300원</strong></li>
              <li>환전 신청 시 신청금액과 함께 출금</li>
              <li>취소 시 배송비 반환 / 미수령 반송 시 미반환</li>
            </ul>
          </div>
          <div className="bg-offwhite border border-border rounded-md p-3 text-xs">
            <p className="font-medium text-charcoal mb-1">📅 수령 일자</p>
            <ul className="text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
              <li>오전 9시 이전 신청 → +1영업일 ~ 12영업일 이내 선택</li>
              <li>오전 9시 이후 신청 → +2영업일 ~ 11영업일 이내 선택</li>
              <li>대면 수령: 평일 09:00~18:00</li>
              <li>CU편의점: 24시간 (일부 점포 제외)</li>
            </ul>
          </div>
        </div>

        {/* 수령 지역 + 변경·취소 */}
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <div className="bg-offwhite border border-border rounded-md p-3 text-xs">
            <p className="font-medium text-charcoal mb-1">📍 수령 지역</p>
            <ul className="text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
              <li>대면: 전국 (군지역 이하 불가, 광역시 소재 군지역은 가능)</li>
              <li>
                CU편의점: 수도권 + 대구·경상북도 일부 점포
              </li>
            </ul>
          </div>
          <div className="bg-offwhite border border-border rounded-md p-3 text-xs">
            <p className="font-medium text-charcoal mb-1">🔁 변경·취소</p>
            <ul className="text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
              <li>수령일자 <strong className="text-charcoal">2영업일 전 24:00</strong>까지 변경·취소 가능</li>
              <li>배송중 상태는 변경·취소 불가</li>
              <li>취소 시 취소시점 현찰매입율로 재환전 → 출금계좌 입금</li>
            </ul>
          </div>
        </div>

        {/* 영업점 체크포인트 */}
        <div className="mt-4 bg-warn/5 border border-warn/40 rounded-md p-3 text-xs">
          <p className="font-medium text-charcoal mb-1">
            ⚠️ 영업점 응대 체크포인트
          </p>
          <ul className="text-charcoal-soft space-y-0.5 list-disc list-inside leading-relaxed">
            <li>
              <strong className="text-charcoal">지정된 수령인 외 대리인 수령 불가</strong>{" "}
              — 신분증 + 모바일앱 수령 바코드 모두 필요
            </li>
            <li>
              미수령 시 수령기한(+2영업일 또는 +2영업일+4일) 경과 후 반송 → 5영업일 이내 자동 재환전
            </li>
            <li>
              <strong className="text-charcoal">USD 90% 우대</strong>는 비대면 환전 중 최고 수준 — Buy &amp; Sell 70% / E-지갑 50%보다 유리
            </li>
            <li>건당 2건 이상 동시 신청 불가 (월 3건·연 10건 한도)</li>
          </ul>
        </div>

        <p className="text-[10px] text-charcoal-soft mt-3">
          📄 출처: iM외화배송서비스 상품설명서 (준법감시인 심의필 25-1691호,
          2025.07.29~2027.06.30) + iM외화배송서비스 이용약관
        </p>
      </section>

      {/* 외화 기프티콘 — 별도 페이지 안내 */}
      <section className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🎁</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-charcoal mb-1">
              외화 기프티콘은 별도 페이지입니다
            </p>
            <p className="text-xs text-charcoal-soft leading-relaxed">
              외화 기프티콘 보관·이용한도는 외화 E-지갑·환전예약과 합산
              산정됩니다 (E-지갑 상품설명서 명시). 수령 시 외화수령증(서식
              4012471) 동의 절차가 필요하며 상세 발행·수령 절차는 본부 매뉴얼
              확인 사항입니다.
            </p>
            <Link
              href="/guide/exchange/gift"
              className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary-dark font-medium"
            >
              외화 기프티콘 페이지로 →
            </Link>
          </div>
        </div>
      </section>

      {/* 영업점 직원 확인 사항 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">⚠️ 외화 배송 공통 확인</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>외환규정상 환전 규정 + 통보 의무 동일 적용</li>
          <li>
            USD 10,000 초과 환전 후 휴대 출국 시 세관 신고 의무 (외환거래법 위반 시 처벌)
          </li>
          <li>
            보관한도 USD 10,000은 외화 E-지갑·외화기프티콘·환전예약 미수령액
            합산 산정
          </li>
          <li>상세 절차·한도는 영업점 매뉴얼 기준 (본부 외환부서)</li>
        </ul>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-1 border-b border-border last:border-0">
      <dt className="text-xs text-charcoal-soft sm:w-28 sm:shrink-0 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-charcoal leading-relaxed">{value}</dd>
    </div>
  );
}

function CompareRow({
  label,
  a,
  b,
}: {
  label: string;
  a: string;
  b: string;
}) {
  return (
    <tr className="border-b border-border last:border-0 align-top">
      <td className="p-2.5 text-xs text-charcoal-soft uppercase tracking-wide whitespace-nowrap">
        {label}
      </td>
      <td className="p-2.5 text-charcoal-soft leading-relaxed">{a}</td>
      <td className="p-2.5 text-charcoal-soft leading-relaxed">{b}</td>
    </tr>
  );
}
