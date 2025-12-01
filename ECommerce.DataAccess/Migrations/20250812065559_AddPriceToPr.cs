using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceToPr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Customers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Customers",
                type: "TEXT",
                nullable: true);
        }
    }
}
