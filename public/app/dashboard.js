const app = require('./main')
const toastr = require('toastr')
const banks = require('../../banks')
const salert = require('sweetalert')
const Task = require('data.task')
const config = require('../../config-f')

app.controller('DashboardCtrl', ['$scope', 'HTTP', '$sce', 'Upload', ($scope, HTTP, $sce, Upload) => {
  window.s = $scope
  const graphData = []
  let lastHeight = null
  $scope.blockRate = 1
  $scope.syncRate = 100
  $scope.syncPercentage = 0
  $scope.configServer = configServer
  HTTP.get('/blockchain/meta')
    .chain(d => HTTP.get('/api/v1/peers').map(peers => Object.assign(d, {peers: peers})))
    .chain(d => HTTP.get('/blockchain/meta1').map(meta => Object.assign(d, meta)))
    .fork(e => {
      $scope.meta = {searches: 0, creditSearches: 0, inserts: 0, peers: [], blocks}
    }, d => {
      $scope.meta = d
    })
  HTTP.get('/blockchain/meta1')
  getCurrentHeight()
  getNodeSyncData()

  $scope.openBlockModal = openBlockModal
  $scope.switchToPublic = switchToPublic
  $scope.switchToOwn = switchToOwn

  function openBlockModal (block) {
    console.log(block)
    const height = block.height || block.header.height
    if (! height) {
      toastr.error('No block height given.')
      return
    }
    $('#blockModal').modal('show')
    HTTP.get(`http://13.76.179.204:46657/block?height=${height}`)
      .map(res => res.result[1])
      .map(res => ({
        hash: res.block_meta.hash,
        validators_hash: res.block_meta.header.validators_hash,
        num_txs: res.block_meta.header.num_txs,
        validators: res.block.last_commit.precommits,
        validators_signatures: res.block.last_commit.precommits.map(v => v.signature[1]).join(', '),
        validators_addresses: res.block.last_commit.precommits.map(v => v.validator_address).join(', '),
        height: height
      }))
      .fork(err => {
        $('#blockModal').modal('hide')
        salert(`Can't open block`, 'The blockchain API is not responding.', 'error')
      }, res => $scope.focusBlock = res)
  }
  function switchToPublic () {
    HTTP.post('/api/v1/switchToPublic')
      .fork(e => console.log(e), d => {
        window.location.reload()
      })
  }
  function switchToOwn () {
    HTTP.post('/api/v1/switchToOwn')
      .fork(e => console.log(e), d => {
        window.location.reload()
      })
  }

  function getCurrentHeight () {
    HTTP.get(`http://${window.location.hostname}:46657/status`)
      .map(r => r.result[1].latest_block_height)
      .fork(e => {}, d => factorBlockRate(d))
  }
  function factorBlockRate (currentHeight) {
    if (! lastHeight) {
      lastHeight = currentHeight
      setTimeout(x => getCurrentHeight(), 3000)
      return
    }
    $scope.blockRate = (currentHeight - lastHeight) / 3 
    lastHeight = currentHeight
    setTimeout(x => getCurrentHeight(), 3000)
    return
  }
  function getNodeSyncData (flag) {
    HTTP.get('http://'+window.location.hostname+':3000/v1/resync/status')
      .fork(e => {
        $scope.nodeIsDown = true
        $scope.hideConnectionSpinner = true
        setTimeout(() => getNodeSyncData(), 3000)
      }, d => {
        $scope.hideConnectionSpinner = true
        if (flag) {
          // getCurrentHeight()
          return
        }
        if (d.diff == 0) {
          $scope.nodeIsDown = false
          $scope.nodeFullyReady = true
          // getCurrentHeight()
          window.gauge.set(100)
          return
        }
        $scope.syncRate = d.speed
        $scope.syncPercentage = d.current_block_height / d.latest_block_height * 100
        getNodeSyncData()
      })
  }

   Morris.Area({
        element: 'graph-area',
        padding: 10,
        behaveLikeLine: true,
        gridEnabled: false,
        gridLineColor: '#dddddd',
        axes: true,
        fillOpacity: .7,
        data: graphData,
        lineColors: ['#32D2C9'],
        xkey: 'period',
        ykeys: ['queries',],
        labels: ['Queries'],
        pointSize: 0,
        lineWidth: 0,
        hideHover: 'auto'

      });


  function fail (err) {
    toastr.error('Something went wrong')
    console.log(err)
  }
}])
