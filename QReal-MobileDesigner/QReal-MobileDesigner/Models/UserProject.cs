//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace QReal_MobileDesigner.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class UserProject
    {
        public int ID { get; set; }
        public string UserId { get; set; }
        public Nullable<int> ProjectId { get; set; }
    
        public virtual Project Project { get; set; }
    }
}
