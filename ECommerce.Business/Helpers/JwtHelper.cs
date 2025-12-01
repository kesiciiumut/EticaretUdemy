using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ECommerce.DataAccess.Entity;
using Microsoft.IdentityModel.Tokens;

namespace ECommerce.Business.Helpers
{
    public static class JwtHelper
    {
        public static string GenerateJwtToken(Customer customer, string secretKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                    new Claim(ClaimTypes.Email, customer.Email ?? string.Empty),
                    new Claim(ClaimTypes.Name, customer.Name ?? string.Empty)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
