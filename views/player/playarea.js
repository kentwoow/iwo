(function (App) {
	'use strict';

	var _this;
	var autoplayisshown = false;
	var precachestarted = false;
	var next_episode_model = false;
	var remaining = false;
	var createdRemaining = false;
	var firstPlay = true;

	var PlayArea = Backbone.Marionette.ItemView.extend({
		template: '#player-tpl',
		className: 'player',
		player: null,

		ui: {
			eyeInfo: '.eye-info-player',
			downloadSpeed: '.download_speed_player',
			uploadSpeed: '.upload_speed_player',
			activePeers: '.active_peers_player',
			downloaded: '.downloaded_player',
			pause: '.fa-pause',
			play: '.fa-play'
		},

		events: {
			'click .close-info-player': 'closePlayer',
			'click .playnownext': 'playNextNow',
			'click .vjs-fullscreen-control': 'toggleFullscreen',
			'click .playnownextNOT': 'playNextNot',
			'click .vjs-subtitles-button': 'toggleSubtitles',
			'click .vjs-text-track': 'moveSubtitles',
			'click .vjs-play-control': 'togglePlay'
		},

		isMovie: function () {
			if (this.model.get('tvdb_id') === undefined) {
				if (this.model.get('type') === 'video/youtube' || this.model.get('imdb_id') === undefined) {
					return undefined;
				} else {
					return 'movie';
				}
			} else {
				return 'show';
			}
		},

		initialize: function () {
			
			this.video = true;
			this.inFullscreen = win.isFullscreen;
		},

		closePlayer: function () {
			win.info('Player closed');
			if (this._WatchingTimer) {
				clearInterval(this._WatchingTimer);
			}
			if (this._AutoPlayCheckTimer) {
				clearInterval(this._AutoPlayCheckTimer);
			}
			// Check if >80% is watched to mark as watched by user  (maybe add value to settings
			
			App.vent.trigger('player:close');
			App.vent.trigger('preload:stop');
			App.vent.trigger('stream:stop');

			this.close();
		},

		onShow: function () {
			$('#header').removeClass('header-shadow').hide();
			// Test to make sure we have title
			win.info('Watching:', this.model.get('title'));
			$('.filter-bar').show();
			$('#player_drag').show();
			_this = this;
			
		},

		displayOverlayMsg: function (message) {
			if ($('.vjs-overlay').length > 0) {
				$('.vjs-overlay').text(message);
				clearTimeout($.data(this, 'overlayTimer'));
				$.data(this, 'overlayTimer', setTimeout(function () {
					$('.vjs-overlay').fadeOut('normal', function () {
						$(this).remove();
					});
				}, 3000));
			} else {
				$(this.player.el()).append('<div class =\'vjs-overlay vjs-overlay-top-left\'>' + message + '</div>');
				$.data(this, 'overlayTimer', setTimeout(function () {
					$('.vjs-overlay').fadeOut('normal', function () {
						$(this).remove();
					});
				}, 3000));
			}
		},

		onClose: function () {
			if (this.model.get('type') === 'video/youtube') { // XXX Sammuel86 Trailer UI Show FIX/HACK -START
				$('.trailer_mouse_catch').remove();
				this.closePlayer();
			}
			$('#player_drag').hide();
			$('#header').show();
			if (!this.dontTouchFS && !this.inFullscreen && win.isFullscreen) {
				win.leaveFullscreen();
			}
			if (this.inFullscreen && !win.isFullscreen) {
				$('.btn-os.fullscreen').removeClass('active');
			}
			App.vent.trigger('player:close');
		}

	});
	App.View.PlayArea = PlayArea;
})(window.App);
