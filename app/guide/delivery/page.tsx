import Link from "next/link";
import { AdminNote } from "@/components/admin/AdminNote";

export default function DeliveryGuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/guide"
        className="text-xs text-charcoal-soft hover:text-primary inline-flex items-center gap-1 mb-3"
      >
        ← 가이드 홈
      </Link>
      <header className="mb-6">
        <p className="text-xs text-primary font-medium tracking-wide mb-1">
          📦 외화 배송·기프티콘
        </p>
        <h1 className="text-3xl font-bold mb-2">외화 수령 (비대면)</h1>
        <p className="text-sm text-charcoal-soft">
          영업점 방문 없이 외화 수령하는 두 가지 방식. iM외화배송 약관 + 외화수령증
          본문 기반.
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

        <div className="mt-3 bg-offwhite border border-border rounded-md p-3 text-xs text-charcoal-soft space-y-1">
          <p>
            <strong>배송 취소</strong>: 모바일뱅킹에서 가능. 재환전 시{" "}
            <strong>취소 시점 현찰매입율</strong> 적용 → 신청 시 출금계좌로 입금.
          </p>
          <p>
            <strong>배송비</strong>: 수령방법별 별도. 환전금액과 함께 입출금 예금에서 인출.
          </p>
        </div>

        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: iM외화배송서비스 이용약관
        </p>
      </section>

      {/* 외화 기프티콘 */}
      <section className="bg-white border border-border rounded-xl p-5 mb-4">
        <h2 className="font-bold mb-3">🎁 외화 기프티콘 (외화수령증)</h2>
        <p className="text-sm text-charcoal-soft mb-4">
          외화 수령권을 제3자에게 선물 형태로 전달. 수령자가 수령 시 본인 확인 + 개인정보
          수집·이용 동의 필요.
        </p>

        <dl className="space-y-2 text-sm mb-3">
          <Row
            label="수령 양식"
            value="외화수령증 = 개인(신용)정보 수집·이용 동의서 겸용"
          />
          <Row
            label="수집 정보"
            value="성명, 휴대폰번호, 생년월일 (주민번호 앞 6자리)"
          />
          <Row
            label="수집 목적"
            value="(금융)거래관계 설정·유지·이행·관리 + 금융사고·분쟁·민원 처리"
          />
          <Row
            label="보유 기간"
            value="(금융)거래 종료일로부터 5년 (이후 법령상 의무이행 범위만)"
          />
          <Row
            label="동의 거부"
            value="거부 가능. 단 거부 시 외화기프티콘 계약 체결 불가"
          />
        </dl>

        <div className="bg-offwhite border border-border rounded-md p-3 text-xs text-charcoal-soft space-y-1">
          <p className="font-medium text-charcoal">⚠️ 영업점 직원 확인</p>
          <p>
            수령 시 수령인 본인 확인 + 수령증에 성명·휴대폰·생년월일 기재 + 서명/날인.
            동의 항목 ☐ 동의함 체크 누락 시 거래 진행 불가.
          </p>
        </div>

        <p className="text-[10px] text-charcoal-soft mt-3">
          출처: 외화수령증 (외화기프티콘) 개인(신용)정보 수집·이용 동의서 겸용
        </p>
      </section>

      {/* 영업점 직원 확인 사항 */}
      <section className="bg-offwhite border border-border rounded-xl p-5 text-sm">
        <h3 className="font-medium mb-2">⚠️ 두 서비스 공통 확인</h3>
        <ul className="space-y-1 text-charcoal-soft list-disc list-inside">
          <li>외환규정상 환전 규정 + 통보 의무 동일 적용</li>
          <li>
            USD 10,000 초과 환전 후 휴대 출국 시 세관 신고 의무 (외환거래법 위반 시 처벌)
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
