type commentPropsType = {
   blogCommetData: any;
}

const Comment = ({blogCommetData}: commentPropsType) => {
   return (
      <div>
     {blogCommetData && blogCommetData.length > 0 && blogCommetData.map((item: any)=>(
      <div className="tg-tour-about-cus-review-wrap tg-blog-details-review mb-25">
         <ul>
            <li className="mb-40">
               <div className="tg-tour-about-cus-review d-flex">
                  <div>
                     <div className="tg-tour-about-cus-name">
                        <span>Author</span>
                        <h6>{item.name}</h6>
                     </div>
                     <p className="text-capitalize lh-28 mb-10">{item.message}</p>
                  </div>
               </div>
            </li>
         </ul>
      </div>
     )) }
      </div>
   )
}

export default Comment
