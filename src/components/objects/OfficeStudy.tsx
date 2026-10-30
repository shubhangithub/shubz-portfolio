/** Office-only perspective studies; source labels carry the biographical information. */
export function OfficeStudy({kind}:{kind:'research'|'education'|'away'}) {
 const paper='var(--nb-paper2)',rule='var(--nb-rule)';
 if(kind==='research')return <svg className="field-object office-study office-study-book" viewBox="0 0 260 150" fill="none" aria-hidden="true">
  <path d="M16 58L178 40L251 106L85 132Z" fill="currentColor" opacity=".12"/>
  <path d="M10 45L174 27L245 90V103L81 129L10 59Z" fill={paper} stroke="currentColor" strokeWidth="2"/>
  <path d="M10 45L174 27L245 90L81 116Z" fill="var(--nb-paper)" stroke="currentColor" strokeWidth="2"/>
  <path d="M24 43L96 114M81 116V129M84 120L241 96M84 124L241 100" stroke="currentColor"/>
  <path d="M47 48L161 35L215 84L102 102Z" stroke="currentColor" opacity=".5"/>
  <path d="M76 53L143 45M86 63L167 53M99 73L148 66" stroke="currentColor" strokeWidth="2"/>
  <path d="M158 72L174 69L185 78L169 82Z M163 73L171 77L178 73" stroke="currentColor"/>
  <path d="M193 93L205 105L190 104L188 94" fill="currentColor"/>
 </svg>;
 return <svg className="field-object office-study office-study-frame" viewBox="0 0 240 180" fill="none" aria-hidden="true">
  <path d="M85 29L120 7L155 29" stroke={rule}/><circle cx="120" cy="7" r="2" fill="currentColor"/>
  <path d="M17 30H228V171H17Z" fill="currentColor" opacity=".1"/>
  <path d="M11 25H223V166H11Z" fill={paper} stroke="currentColor" strokeWidth="3"/>
  <path d="M21 35H213V156H21Z" stroke="currentColor"/>
  <path d="M31 45H203V146H31Z" fill="var(--nb-paper)" stroke={rule}/>
  {kind==='education'?<>
   <path d="M43 130H192M54 126V83L65 73L76 83V126M61 73V65H69V73M82 126V75L113 54L144 75V126M98 126V99Q113 77 128 99V126M151 126V83L164 72L177 83V126M160 72V65H168V72M82 81H144M86 86H140" stroke="currentColor" strokeWidth="1.6"/>
   <path d="M59 93H71M59 106H71M157 94H170M157 108H170M108 68H118M43 137H192" stroke="currentColor"/>
  </>:<>
   <path d="M35 105Q77 84 113 104T200 101M35 121Q72 111 106 123T200 120M35 134Q77 125 115 136T200 130" stroke="currentColor" opacity=".45"/>
   <circle cx="175" cy="68" r="11" stroke="currentColor"/>
   <path d="M54 72Q78 62 103 77Q126 62 152 72V116Q128 105 103 119Q80 106 54 115Z" fill={paper} stroke="currentColor" strokeWidth="2"/>
   <path d="M103 77V119M62 81Q81 74 95 83M62 91Q81 84 95 93M112 83Q130 74 144 81M112 93Q130 84 144 91" stroke="currentColor"/>
   <path d="M152 127L185 91M181 95L189 85L196 91L188 101Z" stroke="currentColor" strokeWidth="2"/>
  </>}
 </svg>;
}
