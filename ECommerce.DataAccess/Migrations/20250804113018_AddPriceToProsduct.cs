using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ECommerce.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceToProsduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Stores",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Stores",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Stores",
                keyColumn: "Id",
                keyValue: 3);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Stores",
                columns: new[] { "Id", "Address", "City", "District", "Email", "IsActive", "PhoneNumber", "StoreName" },
                values: new object[,]
                {
                    { 1, "Rıhtım Cad. No:1", "İstanbul", "Kadıköy", "merkez@ornek.com", true, "02121234567", "Merkez Şube" },
                    { 2, "Rıhtım Cad. No:1", "İstanbul", "Kadıköy", "merkez@ornek.com", true, "02121234567", "gop Şube" },
                    { 3, "Rıhtım Cad. No:1", "İstanbul", "Kadıköy", "merkez@ornek.com", true, "02121234567", "sultangazi Şube" }
                });
        }
    }
}
