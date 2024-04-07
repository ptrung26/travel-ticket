using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.Entities.TableDungChung;
using OrdBaseApplication.Factory;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using newPMS.DanhMuc.Dtos;

namespace newPMS.CodeSystem
{
    [Authorize]
    public class CodeSystemMapService : DanhMucAppService
    {
        private readonly IOrdAppFactory _factory;

        public CodeSystemMapService(IOrdAppFactory factory)
        {
            _factory = factory;
        }

        public async Task<List<CodeSystemDto>> GetListBySource(string codeType, long sourceId)
        {
            var codeSysQuery = await _factory.Repository<CodeSystemEntity, long>().GetQueryableAsync();
            var codeSysMapQuery = await _factory.Repository<CodeSystemMapEntity, long>().GetQueryableAsync();
            return await (from m in codeSysMapQuery.AsNoTracking()
                          join s in codeSysQuery.AsNoTracking() on m.DestinationId equals s.Id
                          where m.CodeType == codeType && m.SourceId == sourceId
                          select new CodeSystemDto
                          {
                              Id = s.Id,
                              ParentId = m.Id,
                              Code = s.Code,
                              Display = s.Display,
                              ParentCode = s.ParentCode,
                          }).ToListAsync();
        }

        public async Task<long> GetSourceId(string codeType, long destinationId)
        {
            var codeSysMapQuery = await _factory.Repository<CodeSystemMapEntity, long>().GetQueryableAsync();
            return await codeSysMapQuery.Where(x => x.CodeType == codeType && x.DestinationId == destinationId)
                .Select(x => x.Id).FirstOrDefaultAsync();
        }

        public async Task Insert(CodeSystemMapEntity input)
        {
            var repo = _factory.Repository<CodeSystemMapEntity, long>();
            var find = await repo.FirstOrDefaultAsync(x => x.CodeType == input.CodeType
                                                           && x.DestinationId == input.DestinationId
                                                                             && x.SourceId == input.SourceId);
            if (find != null)
            {
                return;
            }
            await _factory.Repository<CodeSystemMapEntity, long>().InsertAsync(input);
        }
        [HttpPost]
        public async Task Remove(long id)
        {
            await _factory.Repository<CodeSystemMapEntity, long>().DeleteAsync(id);
        }

        public async Task<CodeSystemDto> GetSourceName(string codeType, long destinationId)
        {
            var codeSysQuery = await _factory.Repository<CodeSystemEntity, long>().GetQueryableAsync();
            var codeSysMapQuery = await _factory.Repository<CodeSystemMapEntity, long>().GetQueryableAsync();
            return await (from m in codeSysMapQuery.AsNoTracking()
                join s in codeSysQuery.AsNoTracking() on m.SourceId equals s.Id
                where m.CodeType == codeType && m.DestinationId == destinationId
                          select new CodeSystemDto
                          {
                              Id = s.Id,
                              Display = s.Display,
                          }).FirstOrDefaultAsync();
        }
    }
}
