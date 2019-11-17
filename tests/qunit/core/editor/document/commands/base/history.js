import History from '../../../../../../../assets/dev/js/editor/document/commands/base/history';

jQuery( () => {
	QUnit.module( 'File: editor/document/commands/base/history', () => {
		QUnit.module( 'History', () => {
			QUnit.test( 'getHistory(): force method implementation', ( assert ) => {
				assert.throws(
					() => {
						const instance = new History( {} );

						instance.getHistory( {} );
					},
					new Error( 'History.getHistory() should be implemented, please provide \'getHistory\' functionality.' )
				);
			} );

			QUnit.test( 'onBeforeRun(): delete `this.args.historyId`', ( assert ) => {
				const fakeArgs = {
					historyId: 'fake',
				},
					fakeHistory = class extends History {
						// eslint-disable-next-line no-unused-vars
						getHistory( args ) {
							return true;
						}
				},

					instance = new fakeHistory( fakeArgs );

				const orig = $e.run;

				$e.run = () => {};

				instance.onBeforeRun( fakeArgs );

				$e.run = orig;

				assert.equal( fakeArgs.histroyId, undefined );
			} );
		} );

		QUnit.test( 'onCatchApply()`', ( assert ) => {
			const fakeHistory = class extends History {
				// eslint-disable-next-line no-unused-vars
				getHistory( args ) {
					return true;
				}
			},
				instance = new fakeHistory( {} );

			instance.historyId = Math.random();

			const orig = $e.run;

			let tempCommand = '',
				tempArgs = '';

			$e.run = ( command, args ) => {
				tempCommand = command;
				tempArgs = args;
			};

			// Use `instance.historyId` for error.
			try {
				instance.onCatchApply( instance.id );
			} catch ( e ) {
				assert.equal( e, instance.historyId );
			}

			$e.run = orig;

			assert.equal( tempCommand, 'document/history/delete-log' );
			assert.equal( tempArgs.id, instance.historyId );
		} );
	} );
} );

