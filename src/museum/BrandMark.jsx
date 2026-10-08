export default function BrandMark({className=''}) {
  return <img className={`brand-mark ${className}`} src={`${import.meta.env.BASE_URL}shanhai-ruyi-mark.svg`} alt="" aria-hidden="true" width="56" height="56"/>
}
