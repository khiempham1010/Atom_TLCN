using AtomStore.Data.Enums;
using AtomStore.Data.Interfaces;
using AtomStore.Infrastructure.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace AtomStore.Data.Entities
{
    [Table("Orders")]
    public class Order : DomainEntity<int>, ISwitchable, IDateTracking
    {
        public Order() { }

        public Order(string customerName, string customerAddress, string customerMobile, string customerMessage,
            OrderStatus orderStatus, PaymentMethod paymentMethod, Status status, Guid? customerId)
        {
            CustomerName = customerName;
            CustomerAddress = customerAddress;
            CustomerPhone = customerMobile;
            CustomerMessage = customerMessage;
            OrderStatus = orderStatus;
            PaymentMethod = paymentMethod;
            Status = status;
            CustomerId = customerId;
        }

        public Order(int id, string customerName, string customerAddress, string customerMobile, string customerMessage,
           OrderStatus orderStatus, PaymentMethod paymentMethod, Status status, Guid? customerId)
        {
            Id = id;
            CustomerName = customerName;
            CustomerAddress = customerAddress;
            CustomerPhone = customerMobile;
            CustomerMessage = customerMessage;
            OrderStatus = orderStatus;
            PaymentMethod = paymentMethod;
            Status = status;
            CustomerId = customerId;
        }
        [Required]
        [StringLength(255)]
        public string CustomerName { get; set; }

        [StringLength(255)]
        public string CustomerAddress { get; set; }
        [StringLength(20)]
        public string CustomerPhone { get; set; }
        [Required]
        [MaxLength(256)]
        public string CustomerMessage { set; get; }
        [StringLength(255)]
        public string CustomerEmail { get; set; }
        public DateTime OrderDate { get; set; }

        public OrderStatus OrderStatus { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public PaymentMethod PaymentMethod { set; get; }

        public Guid? CustomerId { set; get; }

        [ForeignKey("CustomerId")]
        public virtual AppUser User { set; get; }

        public virtual ICollection<OrderDetail> OrderDetails { set; get; }
        public Status Status { get; set; }
    }
}
