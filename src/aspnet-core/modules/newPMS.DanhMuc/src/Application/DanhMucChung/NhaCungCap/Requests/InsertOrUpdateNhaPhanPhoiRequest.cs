using MediatR;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace newPMS.DanhMuc.Requests
{
    public class InsertOrUpdateNhaCungCapRequest : NhaCungCapDto, IRequest<CommonResultDto<bool>>
    {
    }

    public class InsertOrUpdateNhaCungCapRequestHandler : AppBusinessBase, IRequestHandler<InsertOrUpdateNhaCungCapRequest, CommonResultDto<bool>>
    {
        public async Task<CommonResultDto<bool>> Handle(InsertOrUpdateNhaCungCapRequest input, CancellationToken cancellationToken)
        {
            try
            {
                var _nhaPhanPhoiRepos = Factory.Repository<NhaCungCapEntity, long>();
                if (input.Id > 0)
                {
                    var updateData = await _nhaPhanPhoiRepos.GetAsync(input.Id);
                    if (updateData != null)
                    {
                        var phanLoai = input.PhanLoai;
                        input.PhanLoai = string.Join(",", phanLoai);
                        Factory.ObjectMapper.Map<NhaCungCapDto, NhaCungCapEntity>(input, updateData);
                        await _nhaPhanPhoiRepos.UpdateAsync(updateData);
                    } 
                    else
                    {
                        return new CommonResultDto<bool>
                        {
                            IsSuccessful = false,
                            ErrorMessage = "Nhà cung cấp không tồn tại hoặc đã bị xóa!"
                        };
                    }
                }
                else
                {
                    var phanLoai = input.PhanLoai;
                    input.PhanLoai = string.Join(",", phanLoai);
                    var insertData = Factory.ObjectMapper.Map<NhaCungCapDto, NhaCungCapEntity>(input);
                    await _nhaPhanPhoiRepos.InsertAsync(insertData);
                }

                return new CommonResultDto<bool>
                {
                    IsSuccessful = true
                };
            }
            catch (Exception ex)
            {
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra!"
                };
                throw ex;
            }

        }
    }
}
